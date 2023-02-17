from sqlalchemy.orm import Session

from api.models import prescription as prescription_model
from api.schemas import prescription as prescription_schema

def create_prescription(db: Session, prescription: prescription_schema.Prescription):
    db_prescription = prescription_model.Prescription(
        patient_id=prescription.patient_id,
        date_prescribed=prescription.date_prescribed,
        name=prescription.name,
        compound_id=prescription.compound_id,
        price=prescription.price,
        quantity=prescription.quantity,
        refills_left=prescription.refills_left,
        refills_interval=prescription.refills_interval,
        is_active=prescription.is_active
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription

def get_prescriptions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(prescription_model.Prescription).offset(skip).limit(limit).all()

def get_prescriptions_by_patient(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    return db.query(prescription_model.Prescription).filter(prescription_model.Prescription.patient_id == patient_id).offset(skip).limit(limit).all()

