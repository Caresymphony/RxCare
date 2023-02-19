#!/bin/bash

for i in {1..3}; do
  # Generate random data for the prescription
  patient_id=$(shuf -i 1-10 -n 1)
  medication_id=1
  date_prescribed=$(date +"%Y-%m-%dT%H:%M:%S.%N" -d "$((RANDOM % 365)) days ago")
  name=$(shuf -e "Glimepiride" "Atenolol" "Betamethasone" -n 1)
  compound_id=$(shuf -i 100-999 -n 1)
  price=$(shuf -i 5-20 -n 1)
  quantity=1
  refills_left=1
  refills_interval=30
  is_active=true

  # Call the /v1/create_prescription endpoint with the random data
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "{\"patient_id\": \"$patient_id\", \"medication_id\": \"$medication_id\", \"date_prescribed\": \"$date_prescribed\", \"name\": \"$name\", \"compound_id\": \"$compound_id\", \"price\": \"$price\", \"quantity\": \"$quantity\", \"refills_left\": \"$refills_left\", \"refills_interval\": \"$refills_interval\", \"is_active\": \"$is_active\"}" \
    http://192.168.4.21:8000/v1/create_prescription

  sleep 1
done

