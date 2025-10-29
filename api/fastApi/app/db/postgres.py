import asyncpg
from app.core.config import settings

_pg_pool: asyncpg.Pool | None = None

async def ensure_pg_pool():
    global _pg_pool
    if _pg_pool is None:
        _pg_pool = await asyncpg.create_pool(
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB,
            min_size=1,
            max_size=10,
        )
    return _pg_pool

def pg_pool():
    if _pg_pool is None:
        raise RuntimeError("PostgreSQL pool not initialized")
    return _pg_pool

