from fastapi import APIRouter, Depends
from app.core.deps import get_mongo
from app.schemas.misc import AvisCreate

router = APIRouter(prefix="/api/avis", tags=["avis"])

@router.get("/{id_produit}")
async def avis_by_produit(id_produit: str, db=Depends(get_mongo)):
    cur = db["avis"].find({"id_produit": int(id_produit) if id_produit.isdigit() else id_produit}).sort("date", -1)
    return [doc async for doc in cur]

@router.post("", status_code=201)
async def create_avis(payload: AvisCreate, db=Depends(get_mongo)):
    doc = {
        "id_produit": payload.id_produit,
        "auteur": payload.auteur,
        "commentaire": payload.commentaire,
        "note": payload.note,
        "date": __import__("datetime").datetime.utcnow(),
    }
    r = await db["avis"].insert_one(doc)
    doc["_id"] = str(r.inserted_id)
    return doc

