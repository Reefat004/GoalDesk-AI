// GET /api/settings — Get current user settings (planning range)
// PATCH /api/settings — Update user settings (planning range)
//
// For MVP, all settings belong to the demo user (id=1).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Demo user ID (hardcoded for MVP)
const DEMO_USER_ID = 1;

// GET — Return the user's current settings
export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: DEMO_USER_ID },
      select: {
        planningRangeStart: true,
        planningRangeEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Demo user not found. Run `npx prisma db seed` first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      planningRangeStart: user.planningRangeStart,
      planningRangeEnd: user.planningRangeEnd,
    });
  } catch (error) {
    console.error("Failed to get settings:", error);
    return NextResponse.json(
      { error: "Failed to get settings" },
      { status: 500 }
    );
  }
}

// PATCH — Update the user's settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { planningRangeStart, planningRangeEnd } = body;

    // Validate that at least one field is provided
    if (!planningRangeStart && !planningRangeEnd) {
      return NextResponse.json(
        { error: "Provide at least one of: planningRangeStart, planningRangeEnd" },
        { status: 400 }
      );
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (planningRangeStart && !timeRegex.test(planningRangeStart)) {
      return NextResponse.json(
        { error: "planningRangeStart must be in HH:mm format (e.g. '09:00')" },
        { status: 400 }
      );
    }

    if (planningRangeEnd && !timeRegex.test(planningRangeEnd)) {
      return NextResponse.json(
        { error: "planningRangeEnd must be in HH:mm format (e.g. '22:00')" },
        { status: 400 }
      );
    }

    // Build update data (only include provided fields)
    const updateData: { planningRangeStart?: string; planningRangeEnd?: string } = {};
    if (planningRangeStart) updateData.planningRangeStart = planningRangeStart;
    if (planningRangeEnd) updateData.planningRangeEnd = planningRangeEnd;

    const updatedUser = await prisma.user.update({
      where: { id: DEMO_USER_ID },
      data: updateData,
      select: {
        planningRangeStart: true,
        planningRangeEnd: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
