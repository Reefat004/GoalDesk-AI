// POST /api/device/test-message — Format and send a test message (mocked)

import { NextRequest, NextResponse } from "next/server";
import { formatLcdMessage } from "@/lib/lcd-formatter";
import { sendParticleMessage } from "@/lib/particle";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    const device = await prisma.device.findFirst({
      where: { userId: DEMO_USER_ID },
    });
    
    // In MVP phase 1 we mock the device ID if none exists
    const particleDeviceId = device?.particleDeviceId || "mock_particle_id_123";

    const formatted = formatLcdMessage("test", { message: message || "Hello GoalDesk" });

    // Assert that lengths are <= 16
    if (formatted.line1.length > 16 || formatted.line2.length > 16) {
      throw new Error("LCD format violation: lines exceed 16 characters");
    }

    const success = await sendParticleMessage(particleDeviceId, formatted.line1, formatted.line2);

    if (device) {
      await prisma.deviceMessage.create({
        data: {
          deviceId: device.id,
          line1: formatted.line1,
          line2: formatted.line2,
          messageType: "test",
          status: success ? "Sent" : "Failed",
          sentAt: success ? new Date() : null,
        }
      });
    }

    return NextResponse.json({
      success,
      sentMessage: formatted
    });
  } catch (error: any) {
    console.error("Failed to send test message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send test message" },
      { status: 500 }
    );
  }
}
