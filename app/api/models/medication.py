from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship

from .database import Base


class Medication(Base):
    __tablename__ = "medication"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    compound_id = Column(String)
    price = Column(Float)
    is_active = Column(Boolean, default=True)
    prescriptions = relationship("Prescription", back_populates="medication")

    
    
    