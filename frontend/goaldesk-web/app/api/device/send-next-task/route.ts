// POST /api/device/send-next-task — Format and send next task to device

import { NextRequest, NextResponse } from "next/server";
import { formatLcdMessage } from "@/lib/lcd-formatter";
import { sendParticleMessage } from "@/lib/particle";
import { prisma } from "@/lib/db";

const DEMO_USER_ID = 1;

export async function POST(request: NextRequest) {
  try {
    const nextTask = await prisma.task.findFirst({
      where: {
        userId: DEMO_USER_ID,
        status: "Scheduled",
        scheduledStart: { not: null }
      },
      orderBy: { scheduledStart: "asc" },
    });

    let formatted;
    if (!nextTask) {
      formatted = {
        line1: "GoalDesk AI".padEnd(16, " "),
        line2: "No tasks found".padEnd(16, " "),
      };
    } else {
      formatted = formatLcdMessage("task", { title: nextTask.title });
    }

    const device = await prisma.device.findFirst({
      where: { userId: DEMO_USER_ID },
    });
    
    const particleDeviceId = device?.particleDeviceId || "mock_particle_id_123";

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
          messageType: "task",
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
    console.error("Failed to send next task:", error);
    return NextResponse.json(
      { error: "Failed to send next task" },
      { status: 500 }
    );
  }
}
