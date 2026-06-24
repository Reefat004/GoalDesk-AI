// GET /api/tasks/[id] — Get specific task
// PATCH /api/tasks/[id] — Update task (title, description, times)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id, 10);

    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: DEMO_USER_ID },
      include: {
        goal: {
          select: { title: true, category: true, priority: true }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
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
    const taskId = parseInt(id, 10);
    const body = await request.json();

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId, userId: DEMO_USER_ID },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.estimatedMinutes !== undefined) updateData.estimatedMinutes = body.estimatedMinutes;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    
    // Explicit scheduling via PATCH allows manual task movement (Phase 1 MVP requirement)
    if (body.scheduledStart !== undefined) {
      updateData.scheduledStart = body.scheduledStart ? new Date(body.scheduledStart) : null;
      updateData.isUserMoved = true;
    }
    if (body.scheduledEnd !== undefined) {
      updateData.scheduledEnd = body.scheduledEnd ? new Date(body.scheduledEnd) : null;
      updateData.isUserMoved = true;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
