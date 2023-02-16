from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import ForeignKey
import psycopg2
from time import time
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import Counter, Gauge, Histogram, Info, start_http_server


# Define a Pydantic model for the patient data
class Patient(BaseModel):
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
    viewed_notice_of_privacy_practices: bool
    viewed_notice_of_privacy_practices_date: str
    
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
REQUEST_COUNT = Counter('requests_total', 'Total number of requests')
REQUEST_LATENCY = Histogram('request_latency_seconds', 'Request latency in seconds')
REQUEST_SIZE = Histogram('request_size_bytes', 'Request size in bytes')
RESPONSE_SIZE = Histogram('response_size_bytes', 'Response size in bytes')

# Use the Instrumentator class to instrument the FastAPI app with Prometheus metrics
instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app, endpoint="/metrics")

# Define a POST endpoint to add a new patient
@app.post("/v1/patients")
async def add_patient(patient: Patient):
    # Create a connection to the database
    start_time = time()
    conn = psycopg2.connect(
            host="db",
            database="rxcare",
            user="myuser",
            password="mysecretpassword"
    )
    cursor = conn.cursor()

    # Insert the patient data into the patients table
    insert_data = '''
    INSERT INTO patients (
      first_name, last_name, guardian, gender, dob, street1, street2, city, state, country, zip,
      phone, email, language_preference, species, viewed_notice_of_privacy_practices, viewed_notice_of_privacy_practices_date
    ) VALUES (
      %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    );
    '''
    cursor.execute(insert_data, (
        patient.first_name, patient.last_name, patient.guardian, patient.gender, patient.dob,
        patient.street1, patient.street2, patient.city, patient.state, patient.country, patient.zip,
        patient.phone, patient.email, patient.language_preference, patient.species,
        patient.viewed_notice_of_privacy_practices, patient.viewed_notice_of_privacy_practices_date
    ))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    end_time = time()
    latency = (end_time - start_time) * 1000.0  # Convert to milliseconds
    REQUEST_LATENCY.labels(method=request.method).observe(latency)
    # Return the inserted patient data
    return patient

@app.get("/v1/patients")
async def get_all_patients():
    # Create a connection to the database
    conn = psycopg2.connect(
            host="db",
            database="rxcare",
            user="myuser",
            password="mysecretpassword"
    )
    cursor = conn.cursor()

    # Select all rows from the patients table
    select_all = 'SELECT * FROM patients'
    cursor.execute(select_all)

    # Fetch all the rows and convert them to a list of dictionaries
    rows = cursor.fetchall()
    patients = []
    for row in rows:
        patient = Patient(
            id=row[0],
            first_name=row[1],
            last_name=row[2],
            guardian=row[3],
            gender=row[4],
            dob=row[5],
            street1=row[6],
            street2=row[7],
            city=row[8],
            state=row[9],
            country=row[10],
            zip=row[11],
            phone=row[12],
            email=row[13],
            language_preference=row[14],
            species=row[15],
            viewed_notice_of_privacy_practices=bool(row[16]),
            viewed_notice_of_privacy_practices_date=row[17],
        )
        patients.append(patient)

    # Close the connection
    conn.close()

    # Return the list of patients
    return patients

# Define a GET endpoint to retrieve a patient by ID
@app.get("/v2/patients/{patient_id}")
async def get_patient_by_id(patient_id: int):
    # Create a connection to the database
    conn = psycopg2.connect(
            host="db",
            database="rxcare",
            user="myuser",
            password="mysecretpassword"
    )
    cursor = conn.cursor()

    # Select the row with the specified ID from the patients table
    select_by_id = 'SELECT * FROM patients WHERE id = %s'
    cursor.execute(select_by_id, (patient_id,))

    # Fetch the row and convert it to a dictionary
    row = cursor.fetchone()
    if row is not None:
        patient = {
            'id': row[0],
            'first_name': row[1],
            'last_name': row[2],
            'guardian': row[3],
            'gender': row[4],
            'dob': row[5],
            'street1': row[6],
            'street2': row[7],
            'city': row[8],
            'state': row[9],
            'country': row[10],
            'zip': row[11],
            'phone': row[12],
            'email': row[13],
            'language_preference': row[14],
            'species': row[15],
            'viewed_notice_of_privacy_practices': bool(row[16]),
            'viewed_notice_of_privacy_practices_date': row[17],
        }

        # Update Prometheus metrics
        REQUEST_COUNT.inc()
        REQUEST_LATENCY.observe(0.5)  # replace with actual request latency
        REQUEST_SIZE.observe(len(str(patient_id)))
        RESPONSE_SIZE.observe(len(str(patient)))

        # Close the connection and return the patient data
        conn.close()
        return patient

    else:
        # Update Prometheus metrics
        REQUEST_COUNT.inc()
        REQUEST_LATENCY.observe(0.5)  # replace with actual request latency
        REQUEST_SIZE.observe(len(str(patient_id)))

        # Close the connection and return a 404 error
        conn.close()
        return {"error": "Patient not found"} , 404