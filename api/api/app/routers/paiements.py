from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.misc import PaiementCreate, PaiementUpdate

router = APIRouter(prefix="/api/paiements", tags=["paiements"])

@router.get("/{id}")
async def get_paiement(id: str, pool=Depends(get_pg)):
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

