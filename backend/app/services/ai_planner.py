from app.models.models import Goal


def generate_tasks_for_goal(goal: Goal) -> list[dict]:
    """
    Temporary fake AI planner.

    Later, this will call a real AI API.
    For now, it returns simple tasks based on the goal title.
    """

    return [
        {
            "title": f"Plan first step for {goal.title}",
            "description": "Break the goal into smaller pieces.",
            "estimated_minutes": min(goal.daily_minutes, 30),
        },
        {
            "title": f"Work on {goal.title}",
            "description": "Complete one small focused task.",
            "estimated_minutes": goal.daily_minutes,
        },
        {
            "title": f"Review progress for {goal.title}",
            "description": "Write down what you learned or completed.",
            "estimated_minutes": 15,
        },
    ]


"""
AI prompt for real planner:

You are a planning assistant for students. 
Break this goal into small daily tasks that are not overwhelming.

Goal:
{goal_title}

Deadline:
{deadline}

Priority:
{priority}

Preferred time:
{preferred_time_of_day}

Daily available minutes:
{daily_minutes}

Return JSON only in this format:
[
  {
    "title": "short task title",
    "description": "one sentence",
    "estimated_minutes": 30,
    "suggested_day": "YYYY-MM-DD",
    "preferred_time_of_day": "morning/afternoon/evening/night/flexible"
  }
]

Rules:
- Each task must be small and actionable.
- Do not create tasks longer than the user's daily available minutes.
- Avoid vague tasks like "study more."
- Make tasks specific enough that the user knows what to do.

"""