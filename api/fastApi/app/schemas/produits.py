from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, Union

class ProduitCreate(BaseModel):
    id_categorie: Optional[str] = None
    nom: str
    slug: str
    description: Optional[str] = None
    tva: Optional[float] = 20.0
    actif: Optional[bool] = True

class ProduitUpdate(BaseModel):
    id_categorie: Optional[str] = None
    nom: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    tva: Optional[float] = None
    actif: Optional[bool] = None

class VarianteCreate(BaseModel):
    sku: str
    ean: Optional[str] = None
    prix_ht: float
    poids_g: Optional[int] = None
    # accept either a dict (parsed JSON) or a JSON string
    attributs_json: Optional[Union[str, Dict[str, Any]]] = None

class VarianteUpdate(BaseModel):
    sku: Optional[str] = None
    ean: Optional[str] = None
    prix_ht: Optional[float] = None
    poids_g: Optional[int] = None
    # accept either a dict (parsed JSON) or a JSON string
    attributs_json: Optional[Union[str, Dict[str, Any]]] = None

class StockPatch(BaseModel):
    quantite: Optional[int] = None
    reservee: Optional[int] = None
    seuil_alerte: Optional[int] = None

