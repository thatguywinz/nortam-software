import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const logLevels =
  process.env.NODE_ENV === "development"
    ? (["error", "warn"] as const)
    : (["error"] as const);

/**
 * Build the Prisma client.
 *
 * - When `TURSO_DATABASE_URL` is set (production on Vercel), connect to the
 *   serverless-friendly libSQL/Turso database through the Prisma driver
 *   adapter. Remote URLs (libsql:// / https://) use the pure-JS web client so
 *   no native binaries are bundled into the serverless function; file:/memory
 *   URLs use the native client so the same code path can be verified locally.
 * - Otherwise (local development), fall back to the file-based SQLite database
 *   configured via `DATABASE_URL` — zero external setup.
 */
function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  if (tursoUrl) {
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const isLocalFile = tursoUrl.startsWith("file:") || tursoUrl === ":memory:";
    const { createClient } = isLocalFile
      ? require("@libsql/client")
      : require("@libsql/client/web");

    const libsql = createClient({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter, log: [...logLevels] });
  }

  return new PrismaClient({ log: [...logLevels] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
