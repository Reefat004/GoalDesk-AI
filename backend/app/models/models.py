from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default="Demo User")
    email = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False, default="personal")
    deadline = Column(String, nullable=True)
    priority = Column(String, nullable=False, default="medium")
    preferred_time_of_day = Column(String, nullable=False, default="flexible")
    daily_minutes = Column(Integer, nullable=False, default=30)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    estimated_minutes = Column(Integer, nullable=False, default=30)
    scheduled_start = Column(String, nullable=True)
    scheduled_end = Column(String, nullable=True)
    status = Column(String, nullable=False, default="scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CalendarBlock(Base):
    __tablename__ = "calendar_blocks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    block_type = Column(String, nullable=False, default="obligation")
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    recurrence = Column(String, nullable=True)
    is_hard_block = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())