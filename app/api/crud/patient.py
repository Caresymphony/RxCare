from sqlalchemy.orm import Session

from api.models import patient as patient_model
from api.schemas import patient as patient_schema

def create_patient(db: Session, patient: patient_schema.Patients):
    db_patient = patient_model.Patients(
        first_name=patient.first_name,
        last_name=patient.last_name,
        guardian=patient.guardian,
        gender=patient.gender,
        dob=patient.dob,
        street1=patient.street1,
        street2=patient.street2,
        city=patient.city,
        state=patient.state,
        country=patient.country,
        zip=patient.zip,
        phone=patient.phone,
        email=patient.email,
        language_preference=patient.language_preference,
        species=patient.species,
        is_active=patient.is_active)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(patient_model.Patients).offset(skip).limit(limit).all()

