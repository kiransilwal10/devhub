from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db
from app import models
from app.routers import repositories
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
print("Creating database tables...")
models.Base.metadata.create_all(bind=engine)
print("Database tables created!")

app = FastAPI(
    title="DevHub API",
    description="Git repository hosting platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(repositories.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to DevHub API!",
        "version": "1.0.0",
        "database": "PostgreSQL (Supabase)",
        "git_server": "Gitea (Local)",
        "docs": "/docs"
    }

@app.get("/api/test")
def test_endpoint():
    return {"message": "Backend is working!"}

@app.get("/api/db-test")
def test_database(db: Session = Depends(get_db)):
    try:
        result = db.execute("SELECT 1").fetchone()
        return {"status": "success", "message": "Database connected!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))