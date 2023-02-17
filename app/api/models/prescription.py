from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from .database import Base
from .patient import Patients
from .medication import Medication

class Prescription(Base):
    __tablename__ = "prescription"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    medication_id = Column(Integer, ForeignKey('medication.id'), nullable=False)
    date_prescribed = Column(DateTime, nullable=False)
    quantity = Column(Integer, nullable=False)
    refills_left = Column(Integer, nullable=False)
    refills_interval = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    patient = relationship("Patients", back_populates="prescriptions")
    medication = relationship("Medication", back_populates="prescriptions")


    