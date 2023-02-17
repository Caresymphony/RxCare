from pydantic import BaseModel
from typing import Optional

class Patients(BaseModel):
    id: Optional[int]
    first_name: str
    last_name: str
    guardian: str
    gender: str
    dob: str
    street1: str
    street2: str
    city: str
    state: str
    country: str
    zip: str
    phone: str
    email: str
    language_preference: str
    species: str
    is_active: Optional[bool]
    
    class Config:
        orm_mode = True
