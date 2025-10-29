from fastapi import Depends
from .config import settings
from app.db.postgres import pg_pool, ensure_pg_pool
from app.db.mongo import get_mongo_db, ensure_mongo_client

async def get_pg(pool=Depends(ensure_pg_pool)):
    return pool

async def get_mongo(db=Depends(ensure_mongo_client)):
    return get_mongo_db()

