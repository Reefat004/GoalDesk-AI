// GET /api/goals — List all goals
// POST /api/goals — Create a new goal

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      description,
      deadline,
      priority,
      preferredTimeOfDay,
      dailyMinutes,
    } = body;

    // Basic validation
    if (!title || !category || !deadline || !priority || !preferredTimeOfDay || !dailyMinutes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId: DEMO_USER_ID,
        title,
        category,
        description,
        deadline: new Date(deadline),
        priority,
        preferredTimeOfDay,
        dailyMinutes,
        status: "Active",
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Failed to create goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
