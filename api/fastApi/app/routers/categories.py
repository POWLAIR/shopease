from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.misc import CategorieCreate, CategorieUpdate

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("")
async def list_categories(pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM categorie ORDER BY libelle ASC;")
    return [dict(r) for r in rows]

@router.post("", status_code=201)
async def create_category(payload: CategorieCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "INSERT INTO categorie (libelle, slug, parent_id) VALUES ($1,$2,$3) RETURNING *;",
            payload.libelle, payload.slug, payload.parent_id
        )
    return dict(row)

@router.put("/{id}")
async def update_category(id: str, payload: CategorieUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE categorie SET
              libelle = COALESCE($1, libelle),
              slug = COALESCE($2, slug),
              parent_id = COALESCE($3, parent_id)
            WHERE id = $4 RETURNING *;
            """,
            payload.libelle, payload.slug, payload.parent_id, id
        )
    if not row:
        raise HTTPException(404, "Catégorie introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_category(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM categorie WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Catégorie introuvable")

