from fastapi import APIRouter, Depends
from app.core.deps import get_pg
from app.schemas.misc import PromotionCreate, PromotionAttach

router = APIRouter(prefix="/api/promotions", tags=["promotions"])

@router.get("")
async def list_promotions(pool=Depends(get_pg)):
    """Lister toutes les promotions actives"""
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM promotion WHERE actif = true ORDER BY date_debut DESC;")
    return [dict(r) for r in rows]

@router.get("/stats")
async def get_promotions_stats(pool=Depends(get_pg)):
    """Statistiques sur les promotions"""
    async with pool.acquire() as conn:
        # Promotions actives (actives ET dans les dates)
        actives = await conn.fetch(
            """
            SELECT * FROM promotion 
            WHERE actif = true 
            AND date_debut <= NOW() 
            AND date_fin >= NOW()
            ORDER BY date_fin ASC;
            """
        )
        
        # Réduction moyenne en pourcentage
        stats = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) as total_promotions,
                COUNT(*) FILTER (WHERE actif = true AND date_debut <= NOW() AND date_fin >= NOW()) as promotions_actives,
                ROUND(AVG(CASE 
                    WHEN type = 'PERCENT' THEN valeur 
                    ELSE 0 
                END), 2) as reduction_moyenne_pourcent,
                ROUND(AVG(CASE 
                    WHEN type = 'AMOUNT' THEN valeur 
                    ELSE 0 
                END), 2) as reduction_moyenne_montant
            FROM promotion
            WHERE actif = true;
            """
        )
    
    return {
        "promotions_actives": [dict(r) for r in actives],
        "nombre_actives": int(stats["promotions_actives"]),
        "total_promotions": int(stats["total_promotions"]),
        "reduction_moyenne_pourcentage": float(stats["reduction_moyenne_pourcent"] or 0),
        "reduction_moyenne_montant": float(stats["reduction_moyenne_montant"] or 0)
    }

@router.post("", status_code=201)
async def create_promo(payload: PromotionCreate, pool=Depends(get_pg)):
    """Créer une nouvelle promotion"""
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
    """Attacher une promotion à un produit"""
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO produit_promotion (id_produit, id_promo) VALUES ($1,$2) ON CONFLICT DO NOTHING;",
            payload.id_produit, payload.id_promo
        )

