from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.misc import LivraisonCreate, LivraisonUpdate

router = APIRouter(prefix="/api/livraisons", tags=["livraisons"])

@router.get("/{id}")
async def get_livraison(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM livraison WHERE id=$1;", id)
    if not row:
        raise HTTPException(404, "Livraison introuvable")
    return dict(row)

@router.get("/commande/{id_commande}")
async def get_by_commande(id_commande: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM livraison WHERE id_commande=$1;", id_commande)
    return dict(row) if row else None

@router.post("", status_code=201)
async def create_livraison(payload: LivraisonCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO livraison (id_commande, transporteur, num_suivi, statut, cout_ht)
            VALUES ($1,$2,$3,COALESCE($4,'EN_PREPARATION'),COALESCE($5,0))
            RETURNING *;
            """,
            payload.id_commande, payload.transporteur, payload.num_suivi, payload.statut, payload.cout_ht
        )
    return dict(row)

@router.put("/{id}")
async def update_livraison(id: str, payload: LivraisonUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE livraison SET
              transporteur = COALESCE($1, transporteur),
              num_suivi = COALESCE($2, num_suivi),
              statut = COALESCE($3, statut),
              cout_ht = COALESCE($4, cout_ht)
            WHERE id = $5
            RETURNING *;
            """,
            payload.transporteur, payload.num_suivi, payload.statut, payload.cout_ht, id
        )
    if not row:
        raise HTTPException(404, "Livraison introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_livraison(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM livraison WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Livraison introuvable")

