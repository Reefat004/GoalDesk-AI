// POST /api/tasks/schedule — Run the scheduling engine

import { NextRequest, NextResponse } from "next/server";
import { scheduleTasksForUser } from "@/lib/scheduler";

const DEMO_USER_ID = 1;

export async function POST(request: NextRequest) {
  try {
    const result = await scheduleTasksForUser(DEMO_USER_ID);

    return NextResponse.json({
      message: "Scheduling complete",
      scheduledCount: result.scheduledCount,
      unscheduledCount: result.unscheduledCount,
      summary: `${result.scheduledCount} tasks scheduled. ${result.unscheduledCount} tasks could not be scheduled due to lack of time.`
    });
  } catch (error: any) {
    console.error("Failed to schedule tasks:", error);
    return NextResponse.json(
      { error: error.message || "Failed to schedule tasks" },
      { status: 500 }
    );
  }
}
