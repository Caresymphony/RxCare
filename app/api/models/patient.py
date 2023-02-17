from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Patients(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    guardian = Column(String)
    gender = Column(String)
    dob = Column(String)
    street1 = Column(String)
    street2 = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    zip = Column(String)
    phone = Column(String)
    email = Column(String)
    language_preference = Column(String)
    species = Column(String)
    is_active = Column(Boolean, default=True)
    prescriptions = relationship("Prescription", back_populates="patient")
    
