from fastapi import APIRouter, Depends
from app.core.deps import get_mongo
from app.schemas.misc import LogCreate

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.get("/{id_client}")
async def logs_by_client(id_client: str, db=Depends(get_mongo)):
    key = int(id_client) if id_client.isdigit() else id_client
    cur = db["logs"].find({"id_client": key}).sort("timestamp", -1).limit(200)
    return [doc async for doc in cur]

@router.post("", status_code=201)
async def create_log(payload: LogCreate, db=Depends(get_mongo)):
    doc = {
        "id_client": payload.id_client,
        "action": payload.action or "unknown",
        "id_produit": payload.id_produit,
        "timestamp": __import__("datetime").datetime.utcnow(),
    }
    r = await db["logs"].insert_one(doc)
    doc["_id"] = str(r.inserted_id)
    return doc

