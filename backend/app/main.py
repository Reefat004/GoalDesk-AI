from fastapi import FastAPI

app = FastAPI(title="GoalDesk AI API", version="0.0.1")


@app.get("/")
def root():
    return {
        "message": "GoalDesk AI backend is running",
        "version": "0.0.1"
    }