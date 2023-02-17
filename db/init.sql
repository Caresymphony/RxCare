DO $$ BEGIN
IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'myuser') THEN
CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword' CREATEDB;
END IF;
END $$;

SELECT 'CREATE DATABASE rxcare' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rxcare');

\c rxcare;

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    guardian TEXT NOT NULL,
    gender TEXT NOT NULL,
    dob TEXT NOT NULL,
    street1 TEXT NOT NULL,
    street2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    zip TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    language_preference TEXT NOT NULL,
    species TEXT NOT NULL,
);

INSERT INTO patients (
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
    species
) VALUES (
    'Bruce',
    'Banner',
    'John',
    'male',
    '19691218',
    '123 Some Lane',
    'Apt. 123',
    'Los Angeles',
    'CA',
    'US',
    '94402',
    '430-304-3949',
    'hulkout@hulk.com',
    'English',
    'Dog'
);

-- CREATE TABLE IF NOT EXISTS prescription (
--     id SERIAL PRIMARY KEY,
--     patient_id INTEGER NOT NULL REFERENCES patients(id),
--     medication_name TEXT NOT NULL,
--     medication_sig TEXT NOT NULL,
--     prescriber TEXT NOT NULL,
--     date_written TIMESTAMP WITH TIME ZONE NOT NULL,
--     refills_remaining INTEGER NOT NULL,
--     current_rx_status_text TEXT NOT NULL,
--     fillable BOOLEAN NOT NULL,
--     days_supply TEXT NOT NULL,
--     is_refill INTEGER NOT NULL,
--     last_filled_date TIMESTAMP WITH TIME ZONE NOT NULL,
--     expiration_date_utc TIMESTAMP WITH TIME ZONE NOT NULL,
--     number_of_refills_allowed INTEGER NOT NULL,
--     prescribed_brand_name TEXT NOT NULL,
--     prescribed_drug_strength TEXT NOT NULL,
--     prescribed_generic_name TEXT NOT NULL,
--     prescribed_ndc TEXT NOT NULL,
--     prescribed_quantity INTEGER NOT NULL,
--     prescribed_written_name TEXT NOT NULL,
--     quantity_remaining INTEGER NOT NULL,
--     rx_number TEXT NOT NULL,
--     origin TEXT NOT NULL,
--     prescriber_order_number TEXT NOT NULL,
--     date_filled_utc TIMESTAMP WITH TIME ZONE NOT NULL,
--     prescribed_quantity_unit TEXT NOT NULL
-- );


-- INSERT INTO prescription (
--     patient_id,
--     medication_name,
--     medication_sig,
--     prescriber,
--     date_written,
--     refills_remaining,
--     current_rx_status_text,
--     fillable,
--     days_supply,
--     is_refill,
--     last_filled_date,
--     expiration_date_utc,
--     number_of_refills_allowed,
--     prescribed_brand_name,
--     prescribed_drug_strength,
--     prescribed_generic_name,
--     prescribed_ndc,
--     prescribed_quantity,
--     prescribed_written_name,
--     quantity_remaining,
--     rx_number,
--     origin,
--     prescriber_order_number,
--     date_filled_utc,
--     prescribed_quantity_unit
-- ) VALUES (
--     1, -- replace with valid patient_id
--     'Tafluprost',
--     'Wake up at midnight, take then.',
--     'Dr. Bruce Banner',
--     '2020-02-05T00:00:00.000Z',
--     1,
--     'On Hold',
--     true,
--     '90',
--     1,
--     '2020-04-08T11:00:00.000Z',
--     '2021-03-31T11:00:00.000Z',
--     3,
--     'Zioptan',
--     '40 mg',
--     'Tafluprost 40 mg tablet',
--     '555555555555',
--     90,
--     'Tafluprost 40 Mg Tablet',
--     270,
--     '1144477',
--     '5',
--     'AE1234',
--     '2020-04-08T11:00:00.000Z',
--     'EA'
-- );

