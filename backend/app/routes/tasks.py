from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Goal, Task
from app.services.ai_planner import generate_tasks_for_goal

router = APIRouter(prefix="/tasks", tags=["Tasks"])

DEMO_USER_ID = 1


@router.post("/generate/{goal_id}")
def generate_tasks(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == DEMO_USER_ID
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    generated_tasks = generate_tasks_for_goal(goal)

    saved_tasks = []

    for task_data in generated_tasks:
        task = Task(
            user_id=DEMO_USER_ID,
            goal_id=goal.id,
            title=task_data["title"],
            description=task_data["description"],
            estimated_minutes=task_data["estimated_minutes"],
            status="unscheduled",
        )

        db.add(task)
        saved_tasks.append(task)

    db.commit()

    for task in saved_tasks:
        db.refresh(task)

    return saved_tasks


@router.get("/")
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.user_id == DEMO_USER_ID).all()


@router.patch("/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == DEMO_USER_ID
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "completed"
    db.commit()
    db.refresh(task)

    return task