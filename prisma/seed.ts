import { PrismaClient } from "@prisma/client";
import { seedDemoWorkspace } from "../lib/seedData";

// CLI seed entry point (`npm run db:setup` / `prisma db seed`). This runs
// against the local SQLite file in development. Production databases (Turso)
// seed themselves on first access via lib/bootstrap.ts.
const prisma = new PrismaClient();

seedDemoWorkspace(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
