import os

from sqlmodel import Session, create_engine

# Use Vercel Postgres in production, SQLite in development
DATABASE_URL = os.getenv("POSTGRES_URL", "sqlite:///./database.db")

# For Vercel Postgres, we need to use the correct connection string format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure engine based on database type
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)


def get_session():
    with Session(engine) as session:
        yield session
