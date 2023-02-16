DO $$ BEGIN
IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'myuser') THEN
CREATE ROLE myuser WITH LOGIN PASSWORD 'mypassword' CREATEDB;
END IF;
END $$;

SELECT 'CREATE DATABASE rxcare' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rxcare');

\c rxcare;

CREATE TABLE IF NOT EXISTS patient (
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
    viewed_notice_of_privacy_practices BOOLEAN NOT NULL,
    viewed_notice_of_privacy_practices_date TEXT NOT NULL
);

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
    'Dog',
    true,
    '20220101'
);
