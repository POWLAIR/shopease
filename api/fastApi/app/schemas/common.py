from pydantic import BaseModel
from typing import Optional

class Message(BaseModel):
    message: str

class Paginated(BaseModel):
    total: int
    items: list

