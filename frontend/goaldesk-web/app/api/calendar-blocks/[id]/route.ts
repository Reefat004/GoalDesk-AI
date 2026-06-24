// PATCH /api/calendar-blocks/[id] — Update a calendar block
// DELETE /api/calendar-blocks/[id] — Delete a calendar block

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blockId = parseInt(id, 10);
    const body = await request.json();

    const existingBlock = await prisma.calendarBlock.findUnique({
      where: { id: blockId, userId: DEMO_USER_ID },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: "Calendar block not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.blockType !== undefined) updateData.blockType = body.blockType;
    if (body.startTime !== undefined) updateData.startTime = new Date(body.startTime);
    if (body.endTime !== undefined) updateData.endTime = new Date(body.endTime);
    if (body.recurrence !== undefined) updateData.recurrence = body.recurrence;
    if (body.isHardBlock !== undefined) updateData.isHardBlock = body.isHardBlock;

    const updatedBlock = await prisma.calendarBlock.update({
      where: { id: blockId },
      data: updateData,
    });

    return NextResponse.json(updatedBlock);
  } catch (error) {
    console.error("Failed to update calendar block:", error);
    return NextResponse.json(
      { error: "Failed to update calendar block" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blockId = parseInt(id, 10);

    const existingBlock = await prisma.calendarBlock.findUnique({
      where: { id: blockId, userId: DEMO_USER_ID },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: "Calendar block not found" }, { status: 404 });
    }

    await prisma.calendarBlock.delete({
      where: { id: blockId },
    });

    return NextResponse.json({ message: "Calendar block deleted" });
  } catch (error) {
    console.error("Failed to delete calendar block:", error);
    return NextResponse.json(
      { error: "Failed to delete calendar block" },
      { status: 500 }
    );
  }
}
