// GET /api/calendar-blocks — List calendar blocks
// POST /api/calendar-blocks — Create a calendar block

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const blocks = await prisma.calendarBlock.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Failed to fetch calendar blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar blocks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, blockType, startTime, endTime, recurrence, isHardBlock } = body;

    if (!title || !blockType || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const block = await prisma.calendarBlock.create({
      data: {
        userId: DEMO_USER_ID,
        title,
        blockType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        recurrence: recurrence || "None",
        isHardBlock: isHardBlock !== undefined ? isHardBlock : true,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("Failed to create calendar block:", error);
    return NextResponse.json(
      { error: "Failed to create calendar block" },
      { status: 500 }
    );
  }
}
