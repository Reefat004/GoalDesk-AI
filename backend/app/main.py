from fastapi import FastAPI
from app.database import Base, engine
from app.models import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GoalDesk AI API", version="0.0.1")


@app.get("/")
def root():
    return {
        "message": "GoalDesk AI backend is running",
        "version": "0.0.1"
    }