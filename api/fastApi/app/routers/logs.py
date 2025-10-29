from fastapi import APIRouter, Depends
from app.core.deps import get_mongo
from app.schemas.misc import LogCreate
from datetime import datetime

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.get("")
async def list_all_logs(db=Depends(get_mongo)):
    """Récupérer tous les logs"""
    cur = db["logs"].find({}).sort("timestamp", -1).limit(1000)
    docs = [doc async for doc in cur]
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@router.get("/stats")
async def get_logs_stats(db=Depends(get_mongo)):
    """Statistiques sur les logs avec agrégations MongoDB"""
    
    # Agrégation pour calculer les stats
    pipeline = [
        {
            "$facet": {
                # Total des logs
                "total": [
                    {"$count": "count"}
                ],
                # Actions les plus fréquentes
                "actions_frequentes": [
                    {"$group": {"_id": "$action", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}},
                    {"$limit": 10}
                ],
                # Types d'événements les plus fréquents (si field 'type' existe)
                "types_frequents": [
                    {"$match": {"type": {"$exists": True}}},
                    {"$group": {"_id": "$type", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}}
                ]
            }
        }
    ]
    
    result = await db["logs"].aggregate(pipeline).to_list(1)
    
    if not result:
        return {
            "total_logs": 0,
            "actions_frequentes": [],
            "types_frequents": []
        }
    
    data = result[0]
    
    # Extraire les résultats
    total_logs = data["total"][0]["count"] if data["total"] else 0
    
    # Formater les actions fréquentes
    actions = []
    for item in data["actions_frequentes"]:
        actions.append({
            "action": item["_id"],
            "count": item["count"],
            "pourcentage": round((item["count"] / total_logs * 100), 2) if total_logs > 0 else 0
        })
    
    # Formater les types fréquents
    types = []
    for item in data["types_frequents"]:
        types.append({
            "type": item["_id"],
            "count": item["count"],
            "pourcentage": round((item["count"] / total_logs * 100), 2) if total_logs > 0 else 0
        })
    
    return {
        "total_logs": total_logs,
        "actions_frequentes": actions,
        "types_frequents": types
    }

@router.get("/client/{id_client}")
async def logs_by_client(id_client: str, db=Depends(get_mongo)):
    """Récupérer les logs d'un client spécifique"""
    key = int(id_client) if id_client.isdigit() else id_client
    cur = db["logs"].find({"id_client": key}).sort("timestamp", -1).limit(200)
    docs = [doc async for doc in cur]
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@router.post("", status_code=201)
async def create_log(payload: LogCreate, db=Depends(get_mongo)):
    """Créer un nouveau log"""
    doc = {
        "id_client": payload.id_client,
        "action": payload.action or "unknown",
        "id_produit": payload.id_produit,
        "timestamp": datetime.utcnow(),
    }
    r = await db["logs"].insert_one(doc)
    doc["_id"] = str(r.inserted_id)
    return doc

