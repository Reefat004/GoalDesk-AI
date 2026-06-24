// Scheduling Engine for GoalDesk AI
// Places unscheduled tasks into available time slots over a 7-day window.

import { prisma } from "@/lib/db";

// Helper to convert HH:mm string to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper to check if two time ranges overlap
function doRangesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && start2 < end1;
}

export async function scheduleTasksForUser(userId: number) {
  // 1. Get user preferences
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const planningStartMin = timeToMinutes(user.planningRangeStart);
  const planningEndMin = timeToMinutes(user.planningRangeEnd);

  // 2. Define the 7-day window
  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowEnd.getDate() + 7); // 7 days from today

  // 3. Fetch data
  const unscheduledTasks = await prisma.task.findMany({
    where: { userId, status: "Unscheduled" },
    include: { goal: true },
    orderBy: [
      { priority: "desc" }, // High priority first
      { goal: { deadline: "asc" } } // Earlier deadlines first
    ]
  });

  if (unscheduledTasks.length === 0) return { scheduledCount: 0, unscheduledCount: 0 };

  const calendarBlocks = await prisma.calendarBlock.findMany({
    where: { userId, isHardBlock: true }
  });

  const scheduledTasks = await prisma.task.findMany({
    where: {
      userId,
      status: "Scheduled",
      scheduledStart: { gte: windowStart, lt: windowEnd }
    }
  });

  // 4. Generate blocked ranges for the 7-day window
  const blockedRanges: { start: Date; end: Date }[] = [];

  // Add already scheduled tasks
  for (const t of scheduledTasks) {
    if (t.scheduledStart && t.scheduledEnd) {
      blockedRanges.push({ start: t.scheduledStart, end: t.scheduledEnd });
    }
  }

  // Add calendar blocks (expanding weekly recurring ones)
  for (const b of calendarBlocks) {
    if (b.recurrence === "Weekly") {
      // Create a block for each week in the window if it matches the day of week
      for (let i = 0; i < 7; i++) {
        const testDate = new Date(windowStart);
        testDate.setDate(testDate.getDate() + i);
        if (testDate.getDay() === b.startTime.getDay()) {
          const start = new Date(testDate);
          start.setHours(b.startTime.getHours(), b.startTime.getMinutes(), 0, 0);
          
          const end = new Date(testDate);
          end.setHours(b.endTime.getHours(), b.endTime.getMinutes(), 0, 0);
          
          blockedRanges.push({ start, end });
        }
      }
    } else {
      // One-time block
      if (b.startTime >= windowStart && b.endTime <= windowEnd) {
        blockedRanges.push({ start: b.startTime, end: b.endTime });
      }
    }
  }

  // 5. Try to schedule each task
  let scheduledCount = 0;
  let unscheduledCount = 0;

  for (const task of unscheduledTasks) {
    let scheduled = false;

    // Look for a free slot across the 7 days
    for (let dayOffset = 0; dayOffset < 7 && !scheduled; dayOffset++) {
      const currentDay = new Date(windowStart);
      currentDay.setDate(currentDay.getDate() + dayOffset);

      // Start at the user's planning range start
      let currentMinute = planningStartMin;

      // Ensure we don't schedule in the past if looking at today
      if (dayOffset === 0) {
        const nowMinute = now.getHours() * 60 + now.getMinutes();
        if (currentMinute < nowMinute) {
          // Push current minute to next 15-min boundary after now
          currentMinute = Math.ceil(nowMinute / 15) * 15;
        }
      }

      while (currentMinute + task.estimatedMinutes <= planningEndMin && !scheduled) {
        const slotStart = new Date(currentDay);
        slotStart.setHours(Math.floor(currentMinute / 60), currentMinute % 60, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + task.estimatedMinutes);

        // Check against all blocked ranges
        const hasConflict = blockedRanges.some(range => 
          doRangesOverlap(slotStart, slotEnd, range.start, range.end)
        );

        if (!hasConflict) {
          // Found a slot! Update the task in DB
          await prisma.task.update({
            where: { id: task.id },
            data: {
              scheduledStart: slotStart,
              scheduledEnd: slotEnd,
              status: "Scheduled"
            }
          });

          // Add to blocked ranges so future tasks don't overlap
          blockedRanges.push({ start: slotStart, end: slotEnd });
          
          scheduled = true;
          scheduledCount++;
        } else {
          // Move forward by 15 minutes and try again
          currentMinute += 15;
        }
      }
    }

    if (!scheduled) {
      unscheduledCount++;
    }
  }

  return { scheduledCount, unscheduledCount };
}
