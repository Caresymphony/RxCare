#!/bin/bash

for i in {1..10}; do
  # Generate random data for the patient
  first_name=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 10 | head -n 1)
  last_name=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 10 | head -n 1)
  guardian=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 10 | head -n 1)
  gender=$(shuf -e "male" "female" -n 1)
  dob=$(date +"%Y%m%d" -d "$((RANDOM % 365)) days ago")
  street1=$(cat /dev/urandom | tr -dc '[:alnum:] ' | fold -w 20 | head -n 1)
  street2=$(cat /dev/urandom | tr -dc '[:alnum:] ' | fold -w 20 | head -n 1)
  city=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 10 | head -n 1)
  state=$(cat /dev/urandom | tr -dc '[:upper:]' | fold -w 2 | head -n 1)
  country="US"
  zip=$(shuf -i 10000-99999 -n 1)
  phone=$(shuf -i 1000000000-9999999999 -n 1)
  email=$(cat /dev/urandom | tr -dc '[:lower:]' | fold -w 10 | head -n 1)@$(cat /dev/urandom | tr -dc '[:lower:]' | fold -w 5 | head -n 1).com
  language_preference=$(shuf -e "English" "Spanish" "French" -n 1)
  species=$(shuf -e "Dog" "Cat" "Bird" "Fish" -n 1)

  # Call the /v1/create_patient endpoint with the random data
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "{\"first_name\": \"$first_name\", \"last_name\": \"$last_name\", \"guardian\": \"$guardian\", \"gender\": \"$gender\", \"dob\": \"$dob\", \"street1\": \"$street1\", \"street2\": \"$street2\", \"city\": \"$city\", \"state\": \"$state\", \"country\": \"$country\", \"zip\": \"$zip\", \"phone\": \"$phone\", \"email\": \"$email\", \"language_preference\": \"$language_preference\", \"species\": \"$species\"}" \
    http://192.168.4.21:8000/v1/create_patient

  sleep 1
done

