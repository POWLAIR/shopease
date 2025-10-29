from fastapi import APIRouter, Depends, HTTPException
from app.core.deps import get_pg
from app.schemas.clients import ClientCreate, ClientUpdate

router = APIRouter(prefix="/api/clients", tags=["clients"])

@router.get("")
async def list_clients(pool=Depends(get_pg)):
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT id, prenom, nom, email, tel, created_at FROM client ORDER BY created_at DESC;")
    return [dict(r) for r in rows]

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

