from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.commandes import CommandeCreate, CommandeUpdate

router = APIRouter(prefix="/api/commandes", tags=["commandes"])

@router.get("")
async def list_commandes(pool=Depends(get_pg)):
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

