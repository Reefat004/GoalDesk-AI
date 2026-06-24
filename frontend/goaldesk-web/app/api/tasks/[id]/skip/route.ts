// PATCH /api/tasks/[id]/skip — Mark a task as skipped

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id, 10);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId, userId: DEMO_USER_ID },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: "Skipped" },
    });

    // Note: In Phase 1F/1G, this might also end active FocusSessions.

    return NextResponse.json({ message: "Task skipped", task: updatedTask });
  } catch (error) {
    console.error("Failed to skip task:", error);
    return NextResponse.json(
      { error: "Failed to skip task" },
      { status: 500 }
    );
  }
}
