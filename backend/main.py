from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mini GitHub API",
    description="A simple GitHub-like API built with FastAPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Mini GitHub API!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/test")
def test_endpoint():
    return {"message": "Backend is working!", "database": "SQLite connected"}