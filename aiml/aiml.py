import requests
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

class DataInput(BaseModel):
    patient_id: int
    name: str
    quantity: int
    price: float

# Set up CORS
origins = ["http://localhost", "http://localhost:3000", "http://web:3000", "http://grafana:2000", "http://localhost:2000", "http://app:8000", "http://localhost:8000"]
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch data from the API
@app.get("/fetch-data")
def fetch_data():
    response = requests.get('http://192.168.4.21:8000/v1/prescriptions')
    prescriptions = response.json()
    prescriptions_json = jsonable_encoder(prescriptions)
    print(prescriptions_json)
    df = pd.DataFrame(prescriptions)
    df['is_aspirin'] = df['name'].apply(lambda x: 1 if x == 'Aspirin' else 0)
    df_grouped = df.groupby('name').agg({'quantity': 'sum', 'is_aspirin': 'sum'})
    df_grouped['prediction'] = df_grouped['quantity'] / df_grouped['is_aspirin']
    max_sale_pred_med = df_grouped['prediction'].idxmax()
    output = {'medication_with_max_sale_prediction': max_sale_pred_med}
    return JSONResponse(content=output)
