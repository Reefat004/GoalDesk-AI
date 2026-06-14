from pydantic import BaseModel
from typing import Optional


class GoalCreate(BaseModel):
    title: str
    category: str = "personal"
    deadline: Optional[str] = None
    priority: str = "medium"
    preferred_time_of_day: str = "flexible"
    daily_minutes: int = 30


class GoalResponse(GoalCreate):
    id: int
    user_id: int
    status: str

    class Config:
        from_attributes = True