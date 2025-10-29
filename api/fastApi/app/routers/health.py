from fastapi import APIRouter
from app.db.postgres import ensure_pg_pool
from app.db.mongo import ensure_mongo_client

router = APIRouter(prefix="/api/health", tags=["health"])

@router.get("")
async def healthcheck():
    # PG
    pool = await ensure_pg_pool()
    async with pool.acquire() as conn:
        await conn.execute("SELECT 1;")
    # Mongo
    await ensure_mongo_client()
    return {"status": "ok", "postgres": True, "mongo": True}

