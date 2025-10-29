from fastapi import APIRouter, Depends
from app.core.deps import get_pg
from app.schemas.misc import PromotionCreate, PromotionAttach

router = APIRouter(prefix="/api/promotions", tags=["promotions"])

@router.get("")
async def list_promotions(pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM promotion WHERE actif = true ORDER BY date_debut DESC;")
    return [dict(r) for r in rows]

@router.post("", status_code=201)
async def create_promo(payload: PromotionCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO promotion (libelle, type, valeur, date_debut, date_fin, actif)
            VALUES ($1,$2,$3,$4,$5,COALESCE($6,true))
            RETURNING *;
            """,
            payload.libelle, payload.type, payload.valeur, payload.date_debut, payload.date_fin, payload.actif
        )
    return dict(row)

@router.post("/attach", status_code=204)
async def attach_promo(payload: PromotionAttach, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO produit_promotion (id_produit, id_promo) VALUES ($1,$2) ON CONFLICT DO NOTHING;",
            payload.id_produit, payload.id_promo
        )

