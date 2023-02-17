from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from .database import Base
from .patient import Patients

class Prescription(Base):
    __tablename__ = "prescription"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    date_prescribed = Column(DateTime, nullable=False)
    quantity = Column(Integer, nullable=False)
    refills_left = Column(Integer, nullable=False)
    refills_interval = Column(Integer, nullable=False)
    name = Column(String, index=True)
    compound_id = Column(String)
    price = Column(Float)
    is_active = Column(Boolean, default=True)
    patient = relationship("Patients", back_populates="prescriptions")


    