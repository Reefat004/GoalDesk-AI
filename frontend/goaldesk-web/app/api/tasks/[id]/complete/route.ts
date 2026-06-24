// PATCH /api/tasks/[id]/complete — Mark a task as completed

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
      data: { status: "Completed" },
    });

    // Note: In Phase 1F/1G, this will also end active FocusSessions and notify the device.

    return NextResponse.json({ message: "Task completed", task: updatedTask });
  } catch (error) {
    console.error("Failed to complete task:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
