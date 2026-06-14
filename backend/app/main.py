from fastapi import FastAPI
from app.database import Base, engine, SessionLocal
from app.models import models
from app.models.models import User, Goal, Task, CalendarBlock
from app.routes import goals, tasks, calendar

# Base.metadata.create_all(bind=engine)

app = FastAPI(title="GoalDesk AI API", version="0.0.1")

app.include_router(goals.router)
app.include_router(tasks.router)
app.include_router(calendar.router)

# def create_demo_user():
#     db = SessionLocal()
#     try:
#         user = db.query(User).filter(User.id == 1).first()
#         if not user:
#             user = User(id=1, name="Demo User", email="demo@goaldesk.local")
#             db.add(user)
#             db.commit()
#     finally:
#         db.close()


# create_demo_user()


@app.get("/")
def root():
    return {
        "message": "GoalDesk AI backend is running",
        "version": "0.0.1"
    }