// Mock AI Planner
// Generates dummy tasks for a goal over the next 7 days.
// This will be replaced by the real OpenAI implementation in Phase 4.

import { prisma } from "@/lib/db";

export async function generateMockTasksForGoal(goalId: number, userId: number) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId, userId },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  // Generate 3 mock tasks for the next few days
  const today = new Date();
  const tasks = [];

  for (let i = 1; i <= 3; i++) {
    // Schedule them on consecutive days starting tomorrow
    const scheduledDate = new Date(today);
    scheduledDate.setDate(today.getDate() + i);
    scheduledDate.setHours(9, 0, 0, 0); // Default to 9:00 AM start

    const endDate = new Date(scheduledDate);
    endDate.setMinutes(endDate.getMinutes() + goal.dailyMinutes);

    tasks.push({
      userId,
      goalId,
      title: `Mock Step ${i} for ${goal.title}`,
      description: `Auto-generated task to make progress on your goal. (Phase 1 Mock)`,
      estimatedMinutes: goal.dailyMinutes,
      scheduledStart: scheduledDate,
      scheduledEnd: endDate,
      priority: goal.priority,
      status: "Scheduled",
      isAiGenerated: true,
    });
  }

  // Bulk insert
  const createdTasks = await prisma.task.createManyAndReturn({
    data: tasks,
  });

  return createdTasks;
}
