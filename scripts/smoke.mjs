// Runtime smoke test against a running server (default :3000). Verifies sign-in
// for both roles and that key pages render. Usage: node scripts/smoke.mjs
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

function makeJar() {
  const jar = new Map();
  return {
    set(res) {
      for (const c of res.headers.getSetCookie?.() ?? []) {
        const [pair] = c.split(";");
        const i = pair.indexOf("=");
        jar.set(pair.slice(0, i), pair.slice(i + 1));
      }
    },
    header() {
      return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
    },
  };
}

async function login(email, password) {
  const jar = makeJar();
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  jar.set(csrfRes);
  const { csrfToken } = await csrfRes.json();
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: jar.header() },
    body: new URLSearchParams({ csrfToken, email, password, callbackUrl: `${BASE}/`, json: "true" }),
    redirect: "manual",
  });
  jar.set(res);
  const session = await (await fetch(`${BASE}/api/auth/session`, { headers: { Cookie: jar.header() } })).json();
  return { jar, session };
}

async function get(jar, path) {
  const res = await fetch(`${BASE}${path}`, { headers: { Cookie: jar.header() }, redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  return { status: res.status, html, location: res.headers.get("location") };
}

const results = [];
function check(name, cond, detail = "") {
  results.push(cond);
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
}

async function main() {
  // Client
  const client = await login("client@nortamdemo.com", "DemoClient123!");
  check("client session", client.session?.user?.role === "CLIENT", client.session?.user?.email);
  const cDash = await get(client.jar, "/client");
  check("client dashboard renders", cDash.status === 200 && /request|MapleBank|Disclosure/i.test(cDash.html));

  // Find a request id on the client dashboard to open a detail page
  const idMatch = cDash.html.match(/\/client\/requests\/([a-z0-9]+)/i);
  if (idMatch) {
    const detail = await get(client.jar, `/client/requests/${idMatch[1]}`);
    check("client request detail renders", detail.status === 200 && detail.html.length > 1000);
  } else {
    check("client request detail link present", false, "no request link found");
  }

  // Employee
  const emp = await login("employee@nortamdemo.com", "DemoEmployee123!");
  check("employee session", emp.session?.user?.role === "EMPLOYEE", emp.session?.user?.email);
  const eDash = await get(emp.jar, "/employee");
  check("employee queue renders", eDash.status === 200 && /Risk|Review|Generate|Queue|request/i.test(eDash.html));

  // Role guard: client must NOT reach /employee
  const guard = await get(client.jar, "/employee");
  check("client blocked from /employee", guard.status !== 200 || /Queue is empty/i.test(guard.html) === false ? guard.status === 307 || guard.status === 302 || guard.location?.includes("/client") : false, `status ${guard.status} -> ${guard.location ?? ""}`);

  const pass = results.every(Boolean);
  console.log(pass ? "\nALL SMOKE CHECKS PASSED" : "\nSOME SMOKE CHECKS FAILED");
  if (!pass) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
