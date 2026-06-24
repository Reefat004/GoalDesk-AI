// POST /api/goals/[id]/generate-tasks — Generate tasks for a goal
// Uses the mock planner (or real AI in Phase 4) to generate 7 days of tasks.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateMockTasksForGoal } from "@/lib/mock-planner";

const DEMO_USER_ID = 1;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goalId = parseInt(id, 10);

    // Make sure goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId, userId: DEMO_USER_ID },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Generate tasks (Mock AI logic for now)
    const newTasks = await generateMockTasksForGoal(goalId, DEMO_USER_ID);

    return NextResponse.json(
      { message: "Tasks generated successfully", count: newTasks.length, tasks: newTasks },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to generate tasks:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate tasks" },
      { status: 500 }
    );
  }
}
