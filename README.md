# Nortam Assure

**AI speed. Human judgment. Certified trust.**

Nortam Assure is an AI-assisted, human-verified translation and localization
platform for documents where a translation error can become a legal, financial,
or reputational risk. AI produces the first draft; Nortam's experts handle
risk-based review, terminology and compliance checks, and final approval — and
every step is captured in an audit trail that ends in a **Nortam Trust
Certificate**.

This repository is a fully working full-stack MVP of that platform.

---

## ✨ What's inside

- **Client portal** — submit translation requests, track status, review the
  AI draft vs. the human-verified final, and download Trust Certificates.
- **Employee workspace** — a review queue with risk scoring, AI first-draft
  generation, human review editor, terminology/compliance checks, workflow
  actions, full audit trail, and certificate issuance.
- **Risk-based routing** — each request is scored Low / Medium / High and routed
  to the right level of human oversight.
- **Audit trail + Trust Certificate** — proof of process for regulated clients.
- **Real authentication** with role-based access (Client / Employee / Admin).

It runs **standalone with zero configuration** — no API keys, no database
server, no manual setup.

---

## 🔑 Demo accounts

The demo workspace is seeded automatically. Use any of these (also shown on the
login screen):

| Role     | Email                      | Password           |
| -------- | -------------------------- | ------------------ |
| Client   | `client@nortamdemo.com`    | `DemoClient123!`   |
| Employee | `employee@nortamdemo.com`  | `DemoEmployee123!` |
| Admin    | `admin@nortamdemo.com`     | `DemoAdmin123!`    |

---

## 🚀 Run locally (zero setup)

Requires Node.js 18+.

```bash
git clone https://github.com/thatguywinz/nortam-software.git
cd nortam-software
cp .env.example .env      # optional — sensible defaults work as-is
npm install
npm run dev
```

Open **http://localhost:3000** and sign in with a demo account above.

On first run the app **creates and seeds its SQLite database automatically** —
you don't need to run any migration or seed command. (If you ever want a clean
reset: `npm run db:setup`.)

No API keys are required: when `ANTHROPIC_API_KEY` is blank, AI first drafts use
a built-in deterministic generator, so the whole workflow stays functional.

---

## 🌐 Deploy a live public URL (Vercel + Turso)

The app is built to run on serverless hosting. Because Vercel's filesystem is
read-only, production uses **[Turso](https://turso.tech)** — a free,
serverless, SQLite-compatible database. The app **self-provisions its schema and
demo data on first access**, so there are no migration steps after deploy.

**1. Create a free Turso database** (one-time, ~2 min):

```bash
# Install the Turso CLI: https://docs.turso.tech/cli/installation
turso auth signup
turso db create nortam-assure
turso db show nortam-assure --url      # copy as TURSO_DATABASE_URL  (libsql://...)
turso db tokens create nortam-assure   # copy as TURSO_AUTH_TOKEN
```

**2. Import this repo into Vercel** — https://vercel.com/new → pick the GitHub
repo. Framework preset auto-detects **Next.js**; leave build settings default.

**3. Add Environment Variables** in the Vercel project (Settings → Environment
Variables):

| Variable             | Value                                                |
| -------------------- | ---------------------------------------------------- |
| `TURSO_DATABASE_URL` | the `libsql://…` URL from step 1                     |
| `TURSO_AUTH_TOKEN`   | the token from step 1                                |
| `NEXTAUTH_SECRET`    | `openssl rand -base64 48` (any strong random string) |
| `NEXTAUTH_URL`       | your deployment URL, e.g. `https://your-app.vercel.app` |
| `AI_PROVIDER`        | `anthropic` (works without a key via local fallback) |
| `ANTHROPIC_API_KEY`  | *(optional)* a Claude key for real AI drafts         |

**4. Deploy.** Visit the URL and sign in with a demo account — the database
provisions itself on that first sign-in. Anyone with the link can now use it.

> Prefer SQLite-on-a-disk hosting instead? The app also runs unchanged on any
> host with a persistent volume (Fly.io, Railway) using the default
> `DATABASE_URL` SQLite file — just leave the `TURSO_*` variables unset.

---

## 🧠 How "standalone" works

- **One database model, two backends.** A single Prisma `sqlite` schema serves
  both a local file (development) and Turso/libSQL (production) via the Prisma
  driver adapter — selected automatically by the presence of
  `TURSO_DATABASE_URL`. See [lib/prisma.ts](lib/prisma.ts).
- **Self-bootstrapping.** [lib/bootstrap.ts](lib/bootstrap.ts) creates the schema
  if it's missing and seeds the demo workspace if the database is empty. It runs
  on the first sign-in / page load and is a cached no-op afterward.
- **No required secrets.** Missing AI keys fall back to a deterministic local
  translator ([lib/aiDraft.ts](lib/aiDraft.ts)); uploads are processed in-memory
  (no disk writes), so the app works on read-only serverless filesystems.

---

## 🛠 Tech stack

Next.js 14 (App Router) · TypeScript · Prisma · SQLite / Turso (libSQL) ·
NextAuth (credentials) · Tailwind CSS · Framer Motion · Zod.

## 📂 Useful scripts

| Command              | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Start the dev server (auto-creates + seeds the DB)     |
| `npm run build`      | Production build                                        |
| `npm start`          | Run the production build                               |
| `npm run db:setup`   | Reset: generate client, push schema, reseed local DB   |
| `npx tsx scripts/verify-turso.ts`  | Verify the Turso/libSQL + bootstrap path |
| `node scripts/smoke.mjs`           | Smoke-test a running server (set `BASE_URL` to test a live deploy) |
