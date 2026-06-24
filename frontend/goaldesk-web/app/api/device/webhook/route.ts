// POST /api/device/webhook — Receive button events from Particle Cloud
// SECURITY ASSERTION: Must handle malformed JSON gracefully without crashing.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Webhook payload parsing failed. Malformed JSON detected.");
      return NextResponse.json(
        { error: "Malformed JSON payload" },
        { status: 400 }
      );
    }

    const { deviceId, event, data, published_at } = body;

    if (!deviceId || !event) {
      return NextResponse.json(
        { error: "Missing required webhook fields" },
        { status: 400 }
      );
    }

    // Find the device in our DB
    const dbDevice = await prisma.device.findFirst({
      where: { particleDeviceId: deviceId }
    });

    if (!dbDevice) {
      console.log(`Webhook received for unknown device ID: ${deviceId}`);
      return NextResponse.json(
        { error: "Device not registered" },
        { status: 404 }
      );
    }

    // Log the event
    await prisma.deviceEvent.create({
      data: {
        deviceId: dbDevice.id,
        eventType: event,
        payload: data || null,
        receivedAt: published_at ? new Date(published_at) : new Date(),
      }
    });

    console.log(`[WEBHOOK] Event '${event}' logged for device ${deviceId}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to process device webhook:", error);
    return NextResponse.json(
      { error: "Internal server error processing webhook" },
      { status: 500 }
    );
  }
}
