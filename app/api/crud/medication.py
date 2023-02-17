from sqlalchemy.orm import Session

from api.models import medication as medication_model
from api.schemas import medication as medication_schema

def create_medication(db: Session, medication: medication_schema.Medication):
    db_medication = medication_model.Medication(
        name=medication.name,
        compound_id=medication.compound_id,
        price=medication.price,
        is_active=medication.is_active)
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

def get_medications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(medication_model.Medication).offset(skip).limit(limit).all()