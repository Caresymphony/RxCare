#!/bin/bash

# Array of common first names
first_names=("Emma" "Olivia" "Ava" "Isabella" "Sophia" "Mia" "Charlotte" "Amelia" "Evelyn" "Abigail" "Harper" "Emily" "Elizabeth" "Avery" "Sofia" "Ella" "Madison" "Scarlett" "Victoria" "Aria")

# Array of common last names
last_names=("Smith" "Johnson" "Williams" "Brown" "Jones" "Miller" "Davis" "Garcia" "Rodriguez" "Martinez" "Hernandez" "Lopez" "Gonzalez" "Perez" "Taylor" "Anderson" "Wilson" "Jackson" "White" "Harris")

# Array of common street names
streets=("Oak" "Pine" "Maple" "Cedar" "Elm" "Spruce" "Holly" "Willow" "Birch" "Cherry" "Ash" "Beech" "Chestnut" "Hickory" "Magnolia" "Mulberry" "Poplar" "Sycamore" "Walnut" "Yew")

# Array of common city names
cities=("New York" "Los Angeles" "Chicago" "Houston" "Phoenix" "Philadelphia" "San Antonio" "San Diego" "Dallas" "San Jose" "Austin" "Jacksonville" "Fort Worth" "Columbus" "San Francisco" "Charlotte" "Indianapolis" "Seattle" "Denver" "Washington")

for i in {1..10}; do
  # Generate random data for the patient
  first_name=${first_names[$RANDOM % ${#first_names[@]}]}
  last_name=${last_names[$RANDOM % ${#last_names[@]}]}
  guardian=$(cat /dev/urandom | LC_CTYPE=C tr -dc '[:alpha:]' | fold -w 10 | head -n 1)
  gender=$(shuf -e "male" "female" -n 1)
  dob=$(date +%F -d "$((RANDOM % 365)) days ago")
  street1_number=$(shuf -i 100-999 -n 1)
  street1_name=${streets[$RANDOM % ${#streets[@]}]}
  street2_number=$(shuf -i 100-999 -n 1)
  street2_name=${streets[$RANDOM % ${#streets[@]}]}
  city=${cities[$RANDOM % ${#cities[@]}]}
  state=$(cat /dev/urandom | LC_CTYPE=C tr -dc '[:upper:]' | fold -w 2 | head -n 1)
  country="US"
  zip=$(shuf -i 10000-99999 -n 1)
  phone=$(shuf -i 1000000000-9999999999 -n 1)
  email=$(cat /dev/urandom | LC_CTYPE=C tr -dc '[:lower:]' | fold -w 10 | head -n 1)@$(cat /dev/urandom | LC_CTYPE=C tr -dc '[:lower:]' | fold -w 5 | head -n 1).com
  language_preference=$(shuf -e "English" "Spanish" "French" -n 1)

  # Call the /v1/create_patient endpoint with the random data
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "{\"first_name\": \"$first_name\", \"last_name\": \"$last_name\", \"guardian\": \"$guardian\", \"gender\": \"$gender\", \"dob\": \"$dob\", \"street1\": \"$street1\", \"street2\": \"$street2\", \"city\": \"$city\", \"state\": \"$state\", \"country\": \"$country\", \"zip\": \"$zip\", \"phone\": \"$phone\", \"email\": \"$email\", \"language_preference\": \"$language_preference\", \"species\": \"$species\"}" \
    http://192.168.4.21:8000/v1/create_patient

  sleep 1
done

