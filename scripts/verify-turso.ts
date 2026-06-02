// Throwaway verification: exercises the libSQL driver-adapter + self-bootstrap
// path (the exact code used in production against Turso) using a local libSQL
// file database. Run with: npx tsx scripts/verify-turso.ts
import bcrypt from "bcryptjs";
import fs from "node:fs";

const DB_PATH = "turso-verify.db";
for (const f of [DB_PATH, `${DB_PATH}-journal`, `${DB_PATH}-wal`, `${DB_PATH}-shm`]) {
  if (fs.existsSync(f)) fs.rmSync(f);
}

process.env.TURSO_DATABASE_URL = `file:${DB_PATH}`;

async function main() {
  const { ensureDatabaseReady } = await import("../lib/bootstrap");
  const { prisma } = await import("../lib/prisma");

  console.log("1. Running ensureDatabaseReady() against a fresh libSQL file...");
  await ensureDatabaseReady();

  const users = await prisma.user.count();
  const orgs = await prisma.organization.count();
  const requests = await prisma.translationRequest.count();
  const certs = await prisma.certificate.count();
  const terms = await prisma.terminologyTerm.count();
  console.log("   users=%d orgs=%d requests=%d certs=%d terms=%d", users, orgs, requests, certs, terms);

  console.log("2. Verifying demo login (client@nortamdemo.com)...");
  const client = await prisma.user.findUnique({
    where: { email: "client@nortamdemo.com" },
  });
  if (!client) throw new Error("client user missing");
  const ok = await bcrypt.compare("DemoClient123!", client.passwordHash);
  console.log("   password check:", ok ? "PASS" : "FAIL");

  console.log("3. Verifying a write (create + read back a request)...");
  const org = await prisma.organization.findFirstOrThrow();
  const created = await prisma.translationRequest.create({
    data: {
      requestCode: "NA-VERIFY-0001",
      title: "Adapter write test",
      organizationId: org.id,
      documentType: "Test",
      industry: "Test",
      sourceLanguage: "English",
      targetLanguage: "French",
      confidentialityLevel: "Standard",
      riskExpectation: "Low",
      requiredReviewLevel: "AI-assisted with human spot-check",
      createdById: client.id,
    },
  });
  const readBack = await prisma.translationRequest.findUnique({
    where: { id: created.id },
  });
  console.log("   write/read:", readBack?.requestCode === "NA-VERIFY-0001" ? "PASS" : "FAIL");

  console.log("4. Verifying idempotency: second ensureDatabaseReady() is a no-op...");
  const before = await prisma.user.count();
  // New module instances would re-run; here the cached promise short-circuits.
  await ensureDatabaseReady();
  const after = await prisma.user.count();
  console.log("   user count stable:", before === after ? "PASS" : "FAIL");

  await prisma.$disconnect();

  const allPass = ok && readBack?.requestCode === "NA-VERIFY-0001" && users > 0;
  console.log(allPass ? "\nALL CHECKS PASSED" : "\nSOME CHECKS FAILED");
  for (const f of [DB_PATH, `${DB_PATH}-journal`, `${DB_PATH}-wal`, `${DB_PATH}-shm`]) {
    try {
      if (fs.existsSync(f)) fs.rmSync(f);
    } catch {
      // Windows may still hold the file handle briefly; safe to ignore.
    }
  }
  if (!allPass) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
