import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DB_URL")

if not DATABASE_URL:
    raise RuntimeError("DB_URL not set in environment")

# Create engine (production-ready config)
engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # moderate pool (good for small/medium apps)
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800,     # avoid stale MySQL connections
    pool_pre_ping=True,    # auto reconnect if connection dies
    echo=False             # IMPORTANT: no SQL logs in production
)

# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

# Base class for models
Base = declarative_base()


# Dependency (BEST PRACTICE)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()