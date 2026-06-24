// POST /api/device/preview-next-task — Preview next task LCD message

import { NextRequest, NextResponse } from "next/server";
import { formatLcdMessage } from "@/lib/lcd-formatter";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function POST(request: NextRequest) {
  try {
    // Find the next scheduled task for the user
    const nextTask = await prisma.task.findFirst({
      where: {
        userId: DEMO_USER_ID,
        status: "Scheduled",
        scheduledStart: { not: null }
      },
      orderBy: { scheduledStart: "asc" },
    });

    if (!nextTask) {
      return NextResponse.json({
        line1: "GoalDesk AI".padEnd(16, " "),
        line2: "No tasks found".padEnd(16, " "),
      });
    }

    const formatted = formatLcdMessage("task", { title: nextTask.title });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Failed to preview next task:", error);
    return NextResponse.json(
      { error: "Failed to preview next task" },
      { status: 500 }
    );
  }
}
