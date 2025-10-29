from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.core.deps import get_pg
from app.schemas.produits import ProduitCreate, ProduitUpdate, VarianteCreate, VarianteUpdate, StockPatch

router = APIRouter(prefix="/api/produits", tags=["produits"])

@router.get("")
async def list_produits(q: Optional[str] = None, categorie_slug: Optional[str] = None, pool=Depends(get_pg)):
    params = []
    sql = """
      SELECT p.*, c.libelle AS categorie_libelle, c.slug AS categorie_slug
      FROM produit p
      LEFT JOIN categorie c ON c.id = p.id_categorie
      WHERE 1=1
    """
    if q:
        params.append(f"%{q}%")
        sql += f" AND (p.nom ILIKE ${len(params)} OR p.description ILIKE ${len(params)})"
    if categorie_slug:
        params.append(categorie_slug)
        sql += f" AND c.slug = ${len(params)}"
    sql += " ORDER BY p.created_at DESC;"
    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *params)
    return [dict(r) for r in rows]

@router.post("", status_code=201)
async def create_produit(payload: ProduitCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO produit (id_categorie, nom, slug, description, tva, actif)
            VALUES ($1,$2,$3,$4,COALESCE($5,20.00), COALESCE($6, true))
            RETURNING *;
            """,
            payload.id_categorie, payload.nom, payload.slug, payload.description, payload.tva, payload.actif
        )
    return dict(row)

@router.put("/{id}")
async def update_produit(id: str, payload: ProduitUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE produit SET
              id_categorie = COALESCE($1, id_categorie),
              nom = COALESCE($2, nom),
              slug = COALESCE($3, slug),
              description = COALESCE($4, description),
              tva = COALESCE($5, tva),
              actif = COALESCE($6, actif)
            WHERE id = $7
            RETURNING *;
            """,
            payload.id_categorie, payload.nom, payload.slug, payload.description, payload.tva, payload.actif, id
        )
    if not row:
        raise HTTPException(404, "Produit introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_produit(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM produit WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Produit introuvable")

# Variantes
@router.get("/{id}/variantes")
async def list_variantes(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT v.*, s.quantite, s.reservee, s.seuil_alerte FROM variante v LEFT JOIN stock s ON s.id_variante = v.id WHERE v.id_produit = $1 ORDER BY v.sku ASC;",
            id
        )
    return [dict(r) for r in rows]

@router.post("/{id}/variantes", status_code=201)
async def create_variante(id: str, payload: VarianteCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        async with conn.transaction():
            v = await conn.fetchrow(
                """
                INSERT INTO variante (id_produit, sku, ean, prix_ht, poids_g, attributs_json)
                VALUES ($1,$2,$3,$4,$5,COALESCE($6,'{}'::jsonb))
                RETURNING *;
                """,
                id, payload.sku, payload.ean, payload.prix_ht, payload.poids_g, payload.attributs_json
            )
            await conn.execute("INSERT INTO stock (id_variante, quantite, reservee, seuil_alerte) VALUES ($1,0,0,0);", v["id"])
    return dict(v)

@router.put("/variantes/{variante_id}")
async def update_variante(variante_id: str, payload: VarianteUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE variante SET
              sku = COALESCE($1, sku),
              ean = COALESCE($2, ean),
              prix_ht = COALESCE($3, prix_ht),
              poids_g = COALESCE($4, poids_g),
              attributs_json = COALESCE($5, attributs_json)
            WHERE id = $6
            RETURNING *;
            """,
            payload.sku, payload.ean, payload.prix_ht, payload.poids_g, payload.attributs_json, variante_id
        )
    if not row:
        raise HTTPException(404, "Variante introuvable")
    return dict(row)

@router.patch("/variantes/{variante_id}/stock")
async def patch_stock(variante_id: str, payload: StockPatch, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE stock SET
              quantite = COALESCE($1, quantite),
              reservee = COALESCE($2, reservee),
              seuil_alerte = COALESCE($3, seuil_alerte)
            WHERE id_variante = $4
            RETURNING *;
            """,
            payload.quantite, payload.reservee, payload.seuil_alerte, variante_id
        )
    if not row:
        raise HTTPException(404, "Stock introuvable")
    return dict(row)

