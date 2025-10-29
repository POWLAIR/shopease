from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.misc import PanierCreate, PanierUpdate, LignePanierCreate, LignePanierUpdate

router = APIRouter(prefix="/api/paniers", tags=["paniers"])

@router.get("")
async def list_paniers(pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM panier ORDER BY created_at DESC;")
    return [dict(r) for r in rows]
    
@router.get("/{id}")
async def get_panier(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM panier WHERE id=$1;", id)
    if not row:
        raise HTTPException(404, "Panier introuvable")
    return dict(row)

@router.post("", status_code=201)
async def create_panier(payload: PanierCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "INSERT INTO panier (id_client, token) VALUES ($1,$2) RETURNING *;",
            payload.id_client, payload.token
        )
    return dict(row)

@router.put("/{id}")
async def update_panier(id: str, payload: PanierUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE panier SET
              id_client = COALESCE($1, id_client),
              token = COALESCE($2, token)
            WHERE id = $3
            RETURNING *;
            """,
            payload.id_client, payload.token, id
        )
    if not row:
        raise HTTPException(404, "Panier introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_panier(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM panier WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Panier introuvable")

@router.get("/{id}/lignes")
async def list_lignes(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT lp.*, v.sku, v.prix_ht, s.quantite AS stock_dispo
            FROM ligne_panier lp
            JOIN variante v ON v.id = lp.id_variante
            LEFT JOIN stock s ON s.id_variante = v.id
            WHERE lp.id_panier = $1;
            """,
            id
        )
    return [dict(r) for r in rows]

@router.post("/{id}/lignes", status_code=201)
async def add_ligne(id: str, payload: LignePanierCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO ligne_panier (id_panier, id_variante, quantite)
            VALUES ($1,$2,$3)
            ON CONFLICT (id_panier, id_variante) DO UPDATE SET quantite = ligne_panier.quantite + EXCLUDED.quantite
            RETURNING *;
            """,
            id, payload.id_variante, payload.quantite
        )
    return dict(row)

@router.put("/{id}/lignes/{variante_id}")
async def update_ligne(id: str, variante_id: str, payload: LignePanierUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE ligne_panier SET quantite = $1
            WHERE id_panier = $2 AND id_variante = $3
            RETURNING *;
            """,
            payload.quantite, id, variante_id
        )
    if not row:
        raise HTTPException(404, "Ligne introuvable")
    return dict(row)

@router.delete("/{id}/lignes/{variante_id}", status_code=204)
async def del_ligne(id: str, variante_id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute(
            "DELETE FROM ligne_panier WHERE id_panier=$1 AND id_variante=$2;",
            id, variante_id
        )
    if res.endswith("0"):
        raise HTTPException(404, "Ligne introuvable")

