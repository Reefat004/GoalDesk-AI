from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import CalendarBlock

router = APIRouter(prefix="/calendar-blocks", tags=["Calendar Blocks"])

DEMO_USER_ID = 1


@router.post("/")
def create_calendar_block(block: dict, db: Session = Depends(get_db)):
    calendar_block = CalendarBlock(
        user_id=DEMO_USER_ID,
        title=block["title"],
        block_type=block.get("block_type", "obligation"),
        start_time=block["start_time"],
        end_time=block["end_time"],
        recurrence=block.get("recurrence"),
        is_hard_block=block.get("is_hard_block", True),
    )

    db.add(calendar_block)
    db.commit()
    db.refresh(calendar_block)

    return calendar_block


@router.get("/")
def list_calendar_blocks(db: Session = Depends(get_db)):
    return db.query(CalendarBlock).filter(
        CalendarBlock.user_id == DEMO_USER_ID
    ).all()