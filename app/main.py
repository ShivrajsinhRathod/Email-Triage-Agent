from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.gmail_service import get_recent_emails
from app.services.triage_service import triage_emails
from app.database import initialize_database


app = FastAPI(
    title="Email Triage Agent",
    description="AI-powered email management and triage system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize local database when the application starts
initialize_database()


@app.get("/")
def root():
    return {
        "message": "Email Triage Agent API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/emails")
def get_emails(limit: int = 10):

    emails = get_recent_emails(limit)

    return {
        "count": len(emails),
        "emails": emails
    }


@app.get("/triage")
def triage(limit: int = 5):

    results = triage_emails(limit)

    return {
        "count": len(results),
        "results": results
    }