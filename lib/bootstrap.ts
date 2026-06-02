import { prisma } from "./prisma";
import { schemaStatements } from "./schemaSql";
import { seedDemoWorkspace } from "./seedData";

// Cache the bootstrap so it runs at most once per server instance. On failure
// the cache is cleared so a later request can retry.
let bootstrapPromise: Promise<void> | null = null;

/**
 * Make the database usable on first access, with no manual setup:
 *   1. Create the schema if the tables don't exist yet. This is required for
 *      remote libSQL/Turso databases, where the Prisma CLI can't push schema
 *      over the wire. Statements use `IF NOT EXISTS`, so this is a safe no-op
 *      against an already-provisioned database (including local SQLite).
 *   2. Seed the demo workspace if the database has no users.
 *
 * Call this before the first query in any server entry point (auth, pages).
 */
export function ensureDatabaseReady(): Promise<void> {
  // Never touch the database during the production build (static analysis /
  // prerendering). It only runs at request time, where env + DB are available.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return Promise.resolve();
  }
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }
  return bootstrapPromise;
}

async function bootstrap(): Promise<void> {
  await ensureSchema();

  const userCount = await prisma.user.count();
  if (userCount > 0) return;

  try {
    await seedDemoWorkspace(prisma);
  } catch (error) {
    // Another serverless instance may have seeded concurrently; only surface
    // the error if the database is still empty.
    const recheck = await prisma.user.count();
    if (recheck === 0) throw error;
  }
}

async function ensureSchema(): Promise<void> {
  // Probe sqlite_master (works on SQLite + libSQL/Turso and never errors on a
  // missing table) so the fast path doesn't emit scary error-level logs.
  const existing = (await prisma.$queryRawUnsafe(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='User'"
  )) as Array<{ name: string }>;

  if (Array.isArray(existing) && existing.length > 0) return;

  // Fresh database (e.g. a new Turso instance) — create the full schema.
  for (const statement of schemaStatements()) {
    await prisma.$executeRawUnsafe(statement);
  }
}
