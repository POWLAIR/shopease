from pydantic import BaseModel, EmailStr
from typing import Optional

class ClientCreate(BaseModel):
    prenom: str
    nom: str
    email: EmailStr
    tel: Optional[str] = None
    pwd_hash: str

class ClientUpdate(BaseModel):
    prenom: Optional[str] = None
    nom: Optional[str] = None
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    pwd_hash: Optional[str] = None

