from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class Prescription(BaseModel):
    id: Optional[int]
    patient_id: int
    date_prescribed: datetime
    name: str
    compound_id: Optional[int]
    price: Optional[float]
    quantity: int
    refills_left: int
    refills_interval: int
    is_active: Optional[bool]

    class Config:
        orm_mode = True
        

