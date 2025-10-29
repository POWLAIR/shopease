from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.misc import AdresseCreate, AdresseUpdate

router = APIRouter(prefix="/api/adresses", tags=["adresses"])

@router.get("/client/{id_client}")
async def by_client(id_client: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM adresse WHERE id_client=$1 ORDER BY libelle ASC;", id_client)
    return [dict(r) for r in rows]

@router.post("", status_code=201)
async def create_adresse(payload: AdresseCreate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO adresse (id_client, libelle, ligne1, ligne2, code_postal, ville, pays, is_default_billing, is_default_shipping)
            VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,false),COALESCE($9,false))
            RETURNING *;
            """,
            payload.id_client, payload.libelle, payload.ligne1, payload.ligne2, payload.code_postal, payload.ville, payload.pays, payload.is_default_billing, payload.is_default_shipping
        )
    return dict(row)

@router.put("/{id}")
async def update_adresse(id: str, payload: AdresseUpdate, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE adresse SET
              libelle = COALESCE($1, libelle),
              ligne1 = COALESCE($2, ligne1),
              ligne2 = COALESCE($3, ligne2),
              code_postal = COALESCE($4, code_postal),
              ville = COALESCE($5, ville),
              pays = COALESCE($6, pays),
              is_default_billing = COALESCE($7, is_default_billing),
              is_default_shipping = COALESCE($8, is_default_shipping)
            WHERE id = $9
            RETURNING *;
            """,
            payload.libelle, payload.ligne1, payload.ligne2, payload.code_postal, payload.ville, payload.pays, payload.is_default_billing, payload.is_default_shipping, id
        )
    if not row:
        raise HTTPException(404, "Adresse introuvable")
    return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_adresse(id: str, pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        res = await conn.execute("DELETE FROM adresse WHERE id=$1;", id)
    if res.endswith("0"):
        raise HTTPException(404, "Adresse introuvable")

