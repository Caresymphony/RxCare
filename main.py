from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI(
    title="RxCare API",
    version="1.0",
)

router_v1 = APIRouter(
    prefix="/v1",
    tags=["v1"],
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL connection
conn = psycopg2.connect(
    host="db",
    database="rxcare",
    user="myuser",
    password="mysecretpassword"
)

# API endpoints
@router_v1.post("/patients")
def create_patient(patient: dict):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO patient (
                first_name,
                last_name,
                guardian,
                gender,
                dob,
                street1,
                street2,
                city,
                state,
                country,
                zip,
                phone,
                email,
                language_preference,
                species,
                viewed_notice_of_privacy_practices,
                viewed_notice_of_privacy_practices_date
            ) VALUES (
                %(first_name)s,
                %(last_name)s,
                %(guardian)s,
                %(gender)s,
                %(dob)s,
                %(street1)s,
                %(street2)s,
                %(city)s,
                %(state)s,
                %(country)s,
                %(zip)s,
                %(phone)s,
                %(email)s,
                %(language_preference)s,
                %(species)s,
                %(viewed_notice_of_privacy_practices)s,
                %(viewed_notice_of_privacy_practices_date)s
            )
        """, patient)
        conn.commit()

    return JSONResponse(content={"status": "success"})

# Define a function for getting all patients from the database
def get_all_patients():
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM patient")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in rows]


# Create a route for getting all patients
@router_v1.get("/patients")
def list_patients():
    all_patients = get_all_patients()
    return JSONResponse(content=all_patients)

app.include_router(router_v1)
