from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Replace with the appropriate values for your PostgreSQL database
SQLALCHEMY_DATABASE_URL = "postgresql://myuser:mysecretpassword@db:5432/rxcare"

# Create an engine to connect to the database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declare a base class for declarative models
Base = declarative_base()