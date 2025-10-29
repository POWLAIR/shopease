from pydantic import BaseModel, Field
from typing import Optional, List

class LigneCommandeIn(BaseModel):
    id_variante: str
    libelle: str
    quantite: int
    prix_unitaire_ht: float
    tva: float

class CommandeCreate(BaseModel):
    ref: str
    id_client: str
    id_adr_fact: str
    id_adr_livr: str
    total_ht: float
    total_tva: float
    total_ttc: float
    lignes: List[LigneCommandeIn]

class CommandeUpdate(BaseModel):
    statut: Optional[str] = None
    id_adr_fact: Optional[str] = None
    id_adr_livr: Optional[str] = None

