// GET /api/tasks — List tasks
// Supports query params for filtering by goalId, status, or date range.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("goalId");
    const status = searchParams.get("status");

    // Build Prisma query dynamically based on searchParams
    const where: any = { userId: DEMO_USER_ID };
    if (goalId) where.goalId = parseInt(goalId, 10);
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { scheduledStart: "asc" },
        { priority: "desc" },
      ],
      include: {
        goal: {
          select: { title: true, category: true, priority: true }
        }
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
