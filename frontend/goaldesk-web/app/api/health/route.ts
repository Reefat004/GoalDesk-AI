// GET /api/health — Health check endpoint
// Returns a simple status response to verify the API is running.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "GoalDesk AI",
  });
}
