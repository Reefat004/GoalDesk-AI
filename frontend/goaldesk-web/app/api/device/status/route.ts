// GET /api/device/status — Get device status

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const device = await prisma.device.findFirst({
      where: { userId: DEMO_USER_ID },
    });

    if (!device) {
      // Mock returning a disconnected state if none seeded
      return NextResponse.json({
        status: "Offline",
        name: "No device paired",
      });
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error("Failed to fetch device status:", error);
    return NextResponse.json(
      { error: "Failed to fetch device status" },
      { status: 500 }
    );
  }
}
