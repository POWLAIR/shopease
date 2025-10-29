from fastapi import APIRouter, Depends
from app.core.deps import get_mongo
from app.schemas.misc import AvisCreate
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/avis", tags=["avis"])

@router.get("")
async def list_all_avis(db=Depends(get_mongo)):
    """Récupérer tous les avis"""
    cur = db["avis"].find({}).sort("date", -1)
    docs = [doc async for doc in cur]
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@router.get("/stats")
async def get_avis_stats(db=Depends(get_mongo)):
    """Statistiques sur les avis avec agrégations MongoDB"""
    
    # Agrégation pour calculer les stats
    pipeline = [
        {
            "$facet": {
                # Note moyenne
                "moyenne": [
                    {"$group": {"_id": None, "note_moyenne": {"$avg": "$note"}}}
                ],
                # Avis ce mois-ci
                "ce_mois": [
                    {
                        "$match": {
                            "date": {
                                "$gte": datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                            }
                        }
                    },
                    {"$count": "total"}
                ],
                # Répartition des notes (1 à 5 étoiles)
                "repartition": [
                    {"$group": {"_id": "$note", "count": {"$sum": 1}}},
                    {"$sort": {"_id": -1}}
                ],
                # Total des avis
                "total": [
                    {"$count": "count"}
                ]
            }
        }
    ]
    
    result = await db["avis"].aggregate(pipeline).to_list(1)
    
    if not result:
        return {
            "note_moyenne": 0,
            "total_avis": 0,
            "avis_ce_mois": 0,
            "repartition_notes": {}
        }
    
    data = result[0]
    
    # Extraire les résultats
    note_moyenne = data["moyenne"][0]["note_moyenne"] if data["moyenne"] else 0
    avis_ce_mois = data["ce_mois"][0]["total"] if data["ce_mois"] else 0
    total_avis = data["total"][0]["count"] if data["total"] else 0
    
    # Formater la répartition des notes
    repartition = {}
    for item in data["repartition"]:
        etoiles = int(item["_id"])
        repartition[f"{etoiles}_etoiles"] = item["count"]
    
    # Ajouter les étoiles manquantes avec 0
    for i in range(1, 6):
        if f"{i}_etoiles" not in repartition:
            repartition[f"{i}_etoiles"] = 0
    
    return {
        "note_moyenne": round(note_moyenne, 2) if note_moyenne else 0,
        "total_avis": total_avis,
        "avis_ce_mois": avis_ce_mois,
        "repartition_notes": dict(sorted(repartition.items(), reverse=True))
    }

@router.get("/{id_produit}")
async def avis_by_produit(id_produit: str, db=Depends(get_mongo)):
    """Récupérer les avis d'un produit spécifique"""
    cur = db["avis"].find({"id_produit": int(id_produit) if id_produit.isdigit() else id_produit}).sort("date", -1)
    docs = [doc async for doc in cur]
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@router.post("", status_code=201)
async def create_avis(payload: AvisCreate, db=Depends(get_mongo)):
    """Créer un nouvel avis"""
    doc = {
        "id_produit": payload.id_produit,
        "auteur": payload.auteur,
        "commentaire": payload.commentaire,
        "note": payload.note,
        "date": datetime.utcnow(),
    }
    r = await db["avis"].insert_one(doc)
    doc["_id"] = str(r.inserted_id)
    return doc

