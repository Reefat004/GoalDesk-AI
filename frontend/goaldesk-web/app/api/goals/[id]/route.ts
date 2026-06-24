// GET /api/goals/[id] — Get a specific goal
// PATCH /api/goals/[id] — Update a specific goal (including archiving/pausing)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goalId = parseInt(id, 10);

    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: DEMO_USER_ID, // Ensure user owns the goal
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Failed to fetch goal:", error);
    return NextResponse.json(
      { error: "Failed to fetch goal" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goalId = parseInt(id, 10);
    const body = await request.json();

    // Make sure goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId, userId: DEMO_USER_ID },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Build update payload
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.deadline !== undefined) updateData.deadline = new Date(body.deadline);
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.preferredTimeOfDay !== undefined) updateData.preferredTimeOfDay = body.preferredTimeOfDay;
    if (body.dailyMinutes !== undefined) updateData.dailyMinutes = body.dailyMinutes;
    if (body.status !== undefined) updateData.status = body.status;

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Failed to update goal:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}
