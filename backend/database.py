# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Get the DATABASE_URL from the .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Raise an error if the environment variable is missing
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env file")

# Set up SQLAlchemy engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
