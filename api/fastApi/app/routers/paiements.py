from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.misc import PaiementCreate, PaiementUpdate

router = APIRouter(prefix="/api/paiements", tags=["paiements"])

@router.get("/stats")
async def get_paiements_stats(pool=Depends(get_pg)):
    """Statistiques sur les paiements"""
    async with pool.acquire() as conn:
        # Statistiques générales
        stats = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) as total_paiements,
                COALESCE(SUM(montant), 0) as montant_total,
                COALESCE(AVG(montant), 0) as montant_moyen,
                COUNT(*) FILTER (WHERE statut IN ('CAPTURED', 'AUTHORIZED')) as nb_reussis,
                COUNT(*) FILTER (WHERE statut = 'FAILED') as nb_echoues,
                COUNT(*) FILTER (WHERE statut = 'REFUNDED') as nb_rembourses
            FROM paiement;
            """
        )
        
        # Répartition par mode de paiement avec pourcentage
        modes = await conn.fetch(
            """
            SELECT 
                mode,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM paiement), 2) as pourcentage
            FROM paiement
            GROUP BY mode
            ORDER BY count DESC;
            """
        )
        
        # Répartition par statut
        statuts = await conn.fetch(
            """
            SELECT 
                statut,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM paiement), 2) as pourcentage
            FROM paiement
            GROUP BY statut
            ORDER BY count DESC;
            """
        )
    
    return {
        "montant_total": float(stats["montant_total"]),
        "montant_moyen": round(float(stats["montant_moyen"]), 2),
        "total_paiements": int(stats["total_paiements"]),
        "nombre_reussis": int(stats["nb_reussis"]),
        "nombre_echoues": int(stats["nb_echoues"]),
        "nombre_rembourses": int(stats["nb_rembourses"]),
        "taux_reussite": round((int(stats["nb_reussis"]) / int(stats["total_paiements"]) * 100), 2) if int(stats["total_paiements"]) > 0 else 0,
        "repartition_par_mode": [
            {
                "mode": r["mode"],
                "count": int(r["count"]),
                "pourcentage": float(r["pourcentage"])
            } for r in modes
        ],
        "repartition_par_statut": [
            {
                "statut": r["statut"],
                "count": int(r["count"]),
                "pourcentage": float(r["pourcentage"])
            } for r in statuts
        ]
    }

@router.get("/{id}")
async def get_paiement(id: str, pool=Depends(get_pg)):
    """Récupérer un paiement par ID"""
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM paiement WHERE id=$1;", id)
    if not row:
        raise HTTPException(404, "Paiement introuvable")
    return dict(row)

@router.get("/commande/{ref}")
async def list_by_commande(ref: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT p.*
            FROM paiement p
            JOIN commande c ON c.id = p.id_commande
            WHERE c.ref = $1
            ORDER BY p.created_at DESC;
            """,
            ref
        )
    return [dict(r) for r in rows]

@router.post("", status_code=201)
async def create_paiement(payload: PaiementCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO paiement (id_commande, mode, montant, statut, transaction_id)
            VALUES ($1,$2,$3,COALESCE($4,'CREATED'),$5)
            RETURNING *;
            """,
            payload.id_commande, payload.mode, payload.montant, payload.statut, payload.transaction_id
        )
    return dict(row)

@router.put("/{id}")
async def update_paiement(id: str, payload: PaiementUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE paiement SET
              statut = COALESCE($1, statut),
              transaction_id = COALESCE($2, transaction_id)
            WHERE id = $3
            RETURNING *;
            """,
            payload.statut, payload.transaction_id, id
        )
    if not row:
        raise HTTPException(404, "Paiement introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_paiement(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM paiement WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Paiement introuvable")

