from fastapi import Depends, FastAPI, HTTPException, APIRouter, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from api.crud import patient as pt
from api.crud import prescription as pr
from api.models import database
from api.schemas import patient, prescription
from api.models.database import SessionLocal, engine
from prometheus_client import Counter, Histogram, Info, generate_latest, Gauge, CONTENT_TYPE_LATEST
from starlette.responses import Response
from typing import List, Optional
import json
import time
database.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RxCare API",
    version="1.0",
)

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
# Define Prometheus metrics
REQUEST_COUNT = Counter("http_requests_total", "Total number of HTTP requests", ["method", "endpoint", "http_status"])
REQUEST_LATENCY = Histogram("http_request_latency_ms", "HTTP request latency in milliseconds", ["method", "endpoint"], buckets=[0.1, 0.5, 1, 5, 10, 30, 60, 120, 300, 600, 1200, 1800])
REQUEST_LATENCY_WITH_ERRORS = Histogram(
    "request_latency_seconds_with_errors",
    "Request latency in seconds with errors",
    ["method", "endpoint", "error_type"],
    buckets=(0.1, 0.5, 1.0, 5.0, 10.0, 30.0, 60.0),
)
ERROR_COUNT = Counter("errors_total", "Total number of HTTP errors", ["method", "endpoint", "status_code"])
PATIENTS_COUNT = Gauge("patients_count", "Number of patients returned by /v1/patients", ["status_code"])
PRESCRIPTIONS_COUNT = Gauge("prescriptions_count", "Number of prescriptions returned by /v1/prescriptions", ["status_code"])
APP_INFO = Info("app_info", "Application information")
security = HTTPBasic()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def update_metrics(request, response, time):
    status_code = response.status_code
    endpoint = request.url.path
    method = request.method
    REQUEST_COUNT.labels(method, endpoint, status_code).inc()
    REQUEST_LATENCY.labels(method, endpoint).observe(time)
    if status_code >= 400:
        ERROR_COUNT.labels(method, endpoint, status_code).inc()

# Set application info
APP_INFO.info({"version": "1.0.0", "description": "RxCare"})

# Expose Prometheus metrics
@app.get("/metrics")
async def metrics():
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)

@app.get("/v1/patients", response_model=patient.Patients)
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        start_time = time.time()
        patients = pt.get_patients(db, skip=skip, limit=limit)
        if not patients:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No patients found")
        process_time = time.time() - start_time
        REQUEST_COUNT.labels("GET", "/v1/patients", 200).inc()
        REQUEST_LATENCY.labels("GET", "/v1/patients").observe(process_time * 1000)
        PATIENTS_COUNT.labels(len(patients)).inc()
        print(f"Found {len(patients)} patients")
        patient_json = jsonable_encoder(patients)
        return JSONResponse(content=patient_json)
    except HTTPException as e:
        print(f"HTTP error getting patients: {e}")
        raise e
    except Exception as e:
        print(f"Error getting patients: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
    finally:
        db.close()
    

@app.post("/v1/create_patient", response_model=patient.Patients)
def create_patient(patient: patient.Patients, db: Session = Depends(get_db)):
    return pt.create_patient(db=db, patient=patient)


@app.get("/v1/prescriptions", response_model=prescription.Prescription)
def get_prescriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    start_time = time.time()
    prescriptions = pr.get_prescriptions(db, skip=skip, limit=limit)
    process_time = time.time() - start_time
    REQUEST_COUNT.labels("GET", "/v1/prescription", 200).inc()
    REQUEST_LATENCY.labels("GET", "/v1/prescription").observe(process_time * 1000)
    PRESCRIPTIONS_COUNT.labels(len(prescriptions)).inc()
    print(f"Found {len(prescriptions)} prescriptions")
    prescriptions_json = jsonable_encoder(prescriptions)
    return JSONResponse(content=prescriptions_json)

@app.post("/v1/create_prescription", response_model=prescription.Prescription)
def create_prescription(prescription: prescription.Prescription, db: Session = Depends(get_db)):
    return pr.create_prescription(db=db, prescription=prescription)

@app.get("/v1/get_prescriptions/{patient_id}", response_model=List[prescription.Prescription])
def get_prescriptions_by_patient(patient_id: int, db: Session = Depends(get_db)):
    db_prescriptions = pr.get_prescriptions_by_patient(db, patient_id=patient_id)
    if not db_prescriptions:
        raise HTTPException(status_code=404, detail="No prescriptions found for the patient")
    return db_prescriptions

