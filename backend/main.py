# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models
from app.routers import repositories, webhooks, auth

# Create database tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created!")

app = FastAPI(
    title="DevHub API",
    description="Git Repository Hosting Platform API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(repositories.router)
app.include_router(webhooks.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to DevHub API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "environment": "development",
        "database": "connected",
        "gitea": "integrated"
    }

@app.get("/api/db-test")
def test_database():
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        result = db.execute("SELECT 1")
        return {
            "status": "success",
            "message": "Database connection successful",
            "test_query": "SELECT 1"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
