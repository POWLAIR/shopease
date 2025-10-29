from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

_client: AsyncIOMotorClient | None = None

async def ensure_mongo_client():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.MONGO_URI)
    return _client

def get_mongo_db():
    if _client is None:
        raise RuntimeError("Mongo client not initialized")
    return _client[settings.MONGO_DB]

