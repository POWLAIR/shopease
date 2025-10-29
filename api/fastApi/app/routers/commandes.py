from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.commandes import CommandeCreate, CommandeUpdate

router = APIRouter(prefix="/api/commandes", tags=["commandes"])

@router.get("")
async def list_commandes(pool=Depends(get_pg)):
    """Lister toutes les commandes"""
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT co.*,
                   (cl.prenom || ' ' || cl.nom) AS client_nom,
                   (SELECT COUNT(*) FROM ligne_commande lc WHERE lc.id_commande = co.id) AS nb_lignes
            FROM commande co
            JOIN client cl ON cl.id = co.id_client
            ORDER BY co.created_at DESC;
            """
        )
    return [dict(r) for r in rows]

@router.get("/stats")
async def get_commandes_stats(pool=Depends(get_pg)):
    """Statistiques sur les commandes"""
    async with pool.acquire() as conn:
        # Statistiques générales
        stats = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) as total_commandes,
                COUNT(*) FILTER (WHERE statut IN ('PAYEE', 'PREPAREE', 'EXPEDIEE', 'LIVREE')) as nb_validees,
                COUNT(*) FILTER (WHERE statut IN ('BROUILLON', 'EN_ATTENTE_PAIEMENT')) as nb_en_attente,
                COUNT(*) FILTER (WHERE statut = 'ANNULEE') as nb_annulees,
                COALESCE(SUM(total_ttc), 0) as montant_total,
                COALESCE(AVG(total_ttc), 0) as montant_moyen
            FROM commande;
            """
        )
        
        # Répartition par statut avec pourcentage
        statuts = await conn.fetch(
            """
            SELECT 
                statut,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM commande), 0), 2) as pourcentage
            FROM commande
            GROUP BY statut
            ORDER BY count DESC;
            """
        )
        
        # Volume de commandes par jour (30 derniers jours)
        volume_par_jour = await conn.fetch(
            """
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as nombre_commandes,
                COALESCE(SUM(total_ttc), 0) as total_ventes
            FROM commande
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC;
            """
        )
    
    return {
        "total_commandes": int(stats["total_commandes"]),
        "nombre_validees": int(stats["nb_validees"]),
        "nombre_en_attente": int(stats["nb_en_attente"]),
        "nombre_annulees": int(stats["nb_annulees"]),
        "montant_total": float(stats["montant_total"]),
        "montant_moyen": round(float(stats["montant_moyen"]), 2),
        "taux_validation": round((int(stats["nb_validees"]) / int(stats["total_commandes"]) * 100), 2) if int(stats["total_commandes"]) > 0 else 0,
        "repartition_par_statut": [
            {
                "statut": str(r["statut"]),
                "count": int(r["count"]),
                "pourcentage": float(r["pourcentage"]) if r["pourcentage"] else 0
            } for r in statuts
        ],
        "volume_par_jour": [
            {
                "date": str(r["date"]),
                "nombre_commandes": int(r["nombre_commandes"]),
                "total_ventes": float(r["total_ventes"])
            } for r in volume_par_jour
        ]
    }

@router.get("/{id}")
async def get_commande(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT co.*,
                   (cl.prenom || ' ' || cl.nom) AS client_nom
            FROM commande co
            JOIN client cl ON cl.id = co.id_client
            WHERE co.id = $1;
            """,
            id
        )
    if not row:
        raise HTTPException(404, "Commande introuvable")
    return dict(row)

@router.post("", status_code=201)
async def create_commande(payload: CommandeCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        async with conn.transaction():
            cmd = await conn.fetchrow(
                """
                INSERT INTO commande (ref, id_client, id_adr_fact, id_adr_livr, total_ht, total_tva, total_ttc)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *;
                """,
                payload.ref, payload.id_client, payload.id_adr_fact, payload.id_adr_livr,
                payload.total_ht, payload.total_tva, payload.total_ttc
            )
            for l in payload.lignes:
                await conn.execute(
                    """
                    INSERT INTO ligne_commande (id_commande, id_variante, libelle, quantite, prix_unitaire_ht, tva)
                    VALUES ($1,$2,$3,$4,$5,$6);
                    """,
                    cmd["id"], l.id_variante, l.libelle, l.quantite, l.prix_unitaire_ht, l.tva
                )
                await conn.execute(
                    "UPDATE stock SET quantite = quantite - $1 WHERE id_variante=$2 AND quantite >= $1;",
                    l.quantite, l.id_variante
                )
    return dict(cmd)

@router.put("/{id}")
async def update_commande(id: str, payload: CommandeUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE commande SET
              statut = COALESCE($1, statut),
              id_adr_fact = COALESCE($2, id_adr_fact),
              id_adr_livr = COALESCE($3, id_adr_livr)
            WHERE id = $4
            RETURNING *;
            """,
            payload.statut, payload.id_adr_fact, payload.id_adr_livr, id
        )
    if not row:
        raise HTTPException(404, "Commande introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_commande(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM commande WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Commande introuvable")

