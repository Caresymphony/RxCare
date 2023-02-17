from typing import Optional
from pydantic import BaseModel

class Medication(BaseModel):
    id: Optional[int]
    name: str
    compound_id: Optional[int]
    price: Optional[float]
    is_active: Optional[bool]
    
    class Config:
        orm_mode = True
