from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Goal
from app.schemas import GoalCreate, GoalResponse

router = APIRouter(prefix="/goals", tags=["Goals"])

DEMO_USER_ID = 1


@router.post("/", response_model=GoalResponse)
def create_goal(goal_data: GoalCreate, db: Session = Depends(get_db)):
    goal = Goal(
        user_id=DEMO_USER_ID,
        title=goal_data.title,
        category=goal_data.category,
        deadline=goal_data.deadline,
        priority=goal_data.priority,
        preferred_time_of_day=goal_data.preferred_time_of_day,
        daily_minutes=goal_data.daily_minutes,
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal


@router.get("/", response_model=list[GoalResponse])
def list_goals(db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == DEMO_USER_ID).all()