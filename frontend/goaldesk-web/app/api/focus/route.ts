// GET /api/focus/sessions — List focus sessions (useful for stats)
// POST /api/focus/start — Start a new focus session for a task

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const sessions = await prisma.focusSession.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { createdAt: "desc" },
      include: {
        task: {
          select: { title: true, goalId: true }
        }
      }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch focus sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch focus sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, plannedMinutes } = body;

    if (!taskId || !plannedMinutes) {
      return NextResponse.json(
        { error: "Missing taskId or plannedMinutes" },
        { status: 400 }
      );
    }

    // Verify task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: DEMO_USER_ID }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Optionally end any currently active sessions for this user
    await prisma.focusSession.updateMany({
      where: { userId: DEMO_USER_ID, status: "Active" },
      data: { status: "Cancelled", endedAt: new Date() }
    });

    const session = await prisma.focusSession.create({
      data: {
        userId: DEMO_USER_ID,
        taskId,
        plannedMinutes,
        status: "Active"
      }
    });

    // Update task status to InProgress
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "InProgress" }
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Failed to start focus session:", error);
    return NextResponse.json(
      { error: "Failed to start focus session" },
      { status: 500 }
    );
  }
}
