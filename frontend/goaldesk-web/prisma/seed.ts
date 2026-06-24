// Seed script for GoalDesk AI
// Creates a demo user with default planning range (9:00 AM – 10:00 PM).
// Run with: npx prisma db seed

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create demo user if it doesn't already exist
  const existingUser = await prisma.user.findUnique({
    where: { id: 1 },
  });

  if (existingUser) {
    console.log("Demo user already exists (id=1). Skipping seed.");
    return;
  }

  const demoUser = await prisma.user.create({
    data: {
      id: 1,
      name: "Demo User",
      email: "demo@goaldesk.ai",
      planningRangeStart: "09:00",
      planningRangeEnd: "22:00",
    },
  });

  console.log("✅ Created demo user:", demoUser);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
