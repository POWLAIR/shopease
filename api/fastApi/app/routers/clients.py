from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.clients import ClientCreate, ClientUpdate

router = APIRouter(prefix="/api/clients", tags=["clients"])

@router.get("")
async def list_clients(pool=Depends(get_pg)):
    """Lister tous les clients"""
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT id, prenom, nom, email, tel, created_at FROM client ORDER BY created_at DESC;")
    return [dict(r) for r in rows]

@router.get("/stats")
async def get_clients_stats(pool=Depends(get_pg)):
    """Statistiques sur les clients"""
    async with pool.acquire() as conn:
        # Statistiques générales
        stats = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) as total_clients,
                -- Nouveaux clients ce mois-ci
                COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) as nouveaux_ce_mois,
                -- Nombre moyen d'adresses par client
                COALESCE(AVG(nb_adresses), 0) as nb_adresses_moyen
            FROM client c
            LEFT JOIN (
                SELECT id_client, COUNT(*) as nb_adresses
                FROM adresse
                GROUP BY id_client
            ) a ON a.id_client = c.id;
            """
        )
        
        # Top clients par nombre de commandes
        top_clients = await conn.fetch(
            """
            SELECT 
                c.id,
                c.prenom,
                c.nom,
                c.email,
                COUNT(co.id) as nb_commandes,
                COALESCE(SUM(co.total_ttc), 0) as total_depense
            FROM client c
            LEFT JOIN commande co ON co.id_client = c.id
            GROUP BY c.id, c.prenom, c.nom, c.email
            ORDER BY nb_commandes DESC, total_depense DESC
            LIMIT 10;
            """
        )
        
        # Nouveaux clients ce mois
        nouveaux_clients = await conn.fetch(
            """
            SELECT 
                id,
                prenom,
                nom,
                email,
                created_at
            FROM client
            WHERE created_at >= DATE_TRUNC('month', NOW())
            ORDER BY created_at DESC;
            """
        )
    
    return {
        "total_clients": int(stats["total_clients"]),
        "nouveaux_ce_mois": int(stats["nouveaux_ce_mois"]),
        "nombre_moyen_adresses": round(float(stats["nb_adresses_moyen"]), 2),
        "top_clients": [
            {
                "id": str(r["id"]),
                "prenom": r["prenom"],
                "nom": r["nom"],
                "email": r["email"],
                "nb_commandes": int(r["nb_commandes"]),
                "total_depense": float(r["total_depense"])
            } for r in top_clients
        ],
        "nouveaux_clients": [
            {
                "id": str(r["id"]),
                "prenom": r["prenom"],
                "nom": r["nom"],
                "email": r["email"],
                "created_at": str(r["created_at"])
            } for r in nouveaux_clients
        ]
    }

@router.post("", status_code=201)
async def create_client(payload: ClientCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO client (prenom, nom, email, tel, pwd_hash)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id, prenom, nom, email, tel, created_at;
            """,
            payload.prenom, payload.nom, payload.email, payload.tel, payload.pwd_hash
        )
    return dict(row)

@router.put("/{id}")
async def update_client(id: str, payload: ClientUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE client SET
              prenom = COALESCE($1, prenom),
              nom = COALESCE($2, nom),
              email = COALESCE($3, email),
              tel = COALESCE($4, tel),
              pwd_hash = COALESCE($5, pwd_hash)
            WHERE id = $6
            RETURNING id, prenom, nom, email, tel, created_at;
            """,
            payload.prenom, payload.nom, payload.email, payload.tel, payload.pwd_hash, id
        )
    if not row:
        raise HTTPException(404, "Client introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_client(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM client WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Client introuvable")

