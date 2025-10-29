from pydantic import BaseModel
from typing import Optional, Any

class AdresseCreate(BaseModel):
    id_client: str
    libelle: str
    ligne1: str
    ligne2: Optional[str] = None
    code_postal: str
    ville: str
    pays: str
    is_default_billing: Optional[bool] = False
    is_default_shipping: Optional[bool] = False

class AdresseUpdate(BaseModel):
    libelle: Optional[str] = None
    ligne1: Optional[str] = None
    ligne2: Optional[str] = None
    code_postal: Optional[str] = None
    ville: Optional[str] = None
    pays: Optional[str] = None
    is_default_billing: Optional[bool] = None
    is_default_shipping: Optional[bool] = None

class CategorieCreate(BaseModel):
    libelle: str
    slug: str
    parent_id: Optional[str] = None

class CategorieUpdate(BaseModel):
    libelle: Optional[str] = None
    slug: Optional[str] = None
    parent_id: Optional[str] = None

class PanierCreate(BaseModel):
    token: str
    id_client: Optional[str] = None

class PanierUpdate(BaseModel):
    token: Optional[str] = None
    id_client: Optional[str] = None

class LignePanierCreate(BaseModel):
    id_variante: str
    quantite: int

class LignePanierUpdate(BaseModel):
    quantite: int

class PaiementCreate(BaseModel):
    id_commande: str
    mode: str
    montant: float
    statut: Optional[str] = None
    transaction_id: Optional[str] = None

class PaiementUpdate(BaseModel):
    statut: Optional[str] = None
    transaction_id: Optional[str] = None

class LivraisonCreate(BaseModel):
    id_commande: str
    transporteur: str
    num_suivi: Optional[str] = None
    statut: Optional[str] = None
    cout_ht: Optional[float] = 0.0

class LivraisonUpdate(BaseModel):
    transporteur: Optional[str] = None
    num_suivi: Optional[str] = None
    statut: Optional[str] = None
    cout_ht: Optional[float] = None

class PromotionCreate(BaseModel):
    libelle: str
    type: str
    valeur: float
    date_debut: str
    date_fin: str
    actif: Optional[bool] = True

class PromotionAttach(BaseModel):
    id_produit: str
    id_promo: str

class AvisCreate(BaseModel):
    id_produit: int | str
    auteur: dict
    note: int
    commentaire: Optional[str] = None

class LogCreate(BaseModel):
    id_client: Optional[int | str] = None
    action: str = "unknown"
    id_produit: Optional[int | str] = None

