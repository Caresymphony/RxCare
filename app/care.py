from fastapi import Depends, FastAPI, HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from api.crud import patient as pt
from api.crud import medication as md
from api.crud import prescription as pr
from api.models import database
from api.schemas import patient, medication, prescription
from api.models.database import SessionLocal, engine
from prometheus_client import Counter, Histogram, Info
import json
import time
database.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RxCare API",
    version="1.0",
)

# Define Prometheus metrics
REQUEST_COUNT = Counter("http_requests_total", "Total number of HTTP requests", ["method", "endpoint", "http_status"])
REQUEST_LATENCY = Histogram("http_request_latency_ms", "HTTP request latency in milliseconds", ["method", "endpoint"])
APP_INFO = Info("app_info", "Application information")

# Set up CORS
origins = ["http://localhost", "http://localhost:3000", "http://web:3000", "http://grafana:2000", "http://localhost:2000"]
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@app.get("/v1/patients", response_model=patient.Patients)
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = pt.get_patients(db, skip=skip, limit=limit)
    print(f"Found {len(patients)} patients")
    patient_json = jsonable_encoder(patients)
    return JSONResponse(content=patient_json)
    

@app.post("/v1/create_patient", response_model=patient.Patients)
def create_patient(patient: patient.Patients, db: Session = Depends(get_db)):
    return pt.create_patient(db=db, patient=patient)

@app.get("/v1/medications", response_model=medication.Medication)
def get_medications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    medication= md.get_medications(db, skip=skip, limit=limit)
    print(f"Found {len(medication)} patients")
    medication_json = jsonable_encoder(medication)
    return JSONResponse(content=medication_json)

@app.post("/v1/create_medication", response_model=medication.Medication)
def create_medication(medication: medication.Medication, db: Session = Depends(get_db)):
    return md.create_medication(db=db, medication=medication)

@app.get("/v1/prescriptions", response_model=prescription.Prescription)
def get_prescriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    prescriptions = pr.get_prescriptions(db, skip=skip, limit=limit)
    print(f"Found {len(prescriptions)} prescriptions")
    prescriptions_json = jsonable_encoder(prescriptions)
    return JSONResponse(content=prescriptions_json)

@app.post("/v1/create_prescription", response_model=prescription.Prescription)
def create_prescription(prescription: prescription.Prescription, db: Session = Depends(get_db)):
    return pr.create_prescription(db=db, prescription=prescription)


# Update Prometheus metrics
def update_metrics(request, response, time):
    REQUEST_COUNT.labels(request.method, request.url.path, response.status_code).inc()
    REQUEST_LATENCY.labels(request.method, request.url.path).observe(time)

# Add middleware to FastAPI application
@app.middleware("http")
async def monitor_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    update_metrics(request, response, process_time)
    return response

# Set application info
APP_INFO.info({"version": "1.0.0", "description": "RxCare"})
