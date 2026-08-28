/**
 * Collect route for a Cloudflare Worker that currently serves static assets
 * only, with no script of its own.
 *
 * This is the brendon-mapinda-portfolio case, and it is the reason that site
 * was not the easy first wiring it looked like. An assets only Worker has no
 * server to set a cookie with, so it cannot recognise a returning visitor at
 * all. Adding this script gives it one.
 *
 * wrangler.jsonc gains a `main` alongside the existing `assets` block, and the
 * assets binding is named so this script can fall through to it:
 *
 *   "main": "src/worker.ts",
 *   "assets": { "directory": "./public", "binding": "ASSETS" }
 *
 * Everything that is not /api/e is handed straight to ASSETS, so the site keeps
 * serving exactly as it did. Note the name ASSETS is reserved in Pages
 * projects, which is one of the reasons everything here is a Worker.
 *
 * Env: BZ_SITE, BZ_SALT as vars, BZ_INGEST_SECRET as a secret, plus optional
 * BZ_ENDPOINT and BZ_RETURNING.
 */

import { collect, optOutCookies, optInCookies } from "./core";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Service binding to the breazy-analytics Worker. See core.ts for why this
   *  is mandatory on Cloudflare rather than an optimisation. */
  COLLECTOR?: { fetch(request: Request): Promise<Response> };
  BZ_SITE?: string;
  BZ_SALT?: string;
  BZ_INGEST_SECRET?: string;
  BZ_ENDPOINT?: string;
  BZ_RETURNING?: string;
}

function cfg(env: Env) {
  if (!env.BZ_SITE || !env.BZ_SALT || !env.BZ_INGEST_SECRET) return null;
  return {
    site: env.BZ_SITE,
    salt: env.BZ_SALT,
    ingestSecret: env.BZ_INGEST_SECRET,
    binding: env.COLLECTOR,
    endpoint: env.BZ_ENDPOINT || "https://analytics.giyant.co.za/e",
    // MISSING UNTIL 28 AUGUST 2026, AND IT WAS QUIETLY BREAKING THE NUMBERS.
    //
    // core.ts reads the visitor's IP from a different header per platform, and
    // consults ONLY the header that platform's own edge writes, because every
    // other one is caller supplied and forgeable. With no platform declared it
    // matched neither branch and fell through to the literal "0.0.0.0".
    //
    // That address then went into the visitor_day HMAC over site, day, IP and
    // user agent. A constant IP means every visitor sharing a user agent on a
    // given day collapsed into ONE value, so unique visitors were counted far
    // too low and returning versus new was wrong with them. Nothing failed and
    // nothing logged, the figures were simply untrue.
    //
    // Hardcoded rather than read from a variable, the same call the Next
    // adapters make: a missing variable falls back to "vercel", which on a
    // Worker means trusting headers a stranger can choose.
    platform: "cloudflare" as const,
    returning: env.BZ_RETURNING !== "off",
  };
}

/**
 * The one host this site answers on. Everything else redirects to it.
 *
 * Renamed from portfolio.giyant.co.za on 28 August 2026 on Brendon's
 * instruction: on giyant.co.za, a subdomain called "portfolio" reads as
 * Giyant's portfolio of work, and this is his personal site rather than the
 * company's. "brendon" says whose it is at a glance.
 *
 * The old subdomain stays attached to this Worker on purpose, so every link
 * already shared, and anything a crawler has already indexed, lands on a 308
 * rather than nothing. That also catches the workers.dev address, which is the
 * one a South African mobile carrier does not resolve at all.
 */
const CANONICAL_HOST = "brendon.giyant.co.za";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Wrong host, right site. 308 so the method survives and so a crawler
    // records the move as permanent and collapses the two hosts into one.
    // Read off the request rather than a build time constant, so attaching
    // another hostname later is a DNS change and never a redeploy.
    const host = request.headers.get("host");
    if (host && host !== CANONICAL_HOST) {
      const to = new URL(url);
      to.host = CANONICAL_HOST;
      to.protocol = "https:";
      to.port = "";
      return Response.redirect(to.toString(), 308);
    }

    if (url.pathname !== "/api/e") {
      // Everything else is the site exactly as it was.
      return env.ASSETS.fetch(request);
    }

    const c = cfg(env);

    if (request.method === "DELETE") {
      const headers = new Headers({ "content-type": "application/json" });
      for (const v of optOutCookies()) headers.append("set-cookie", v);
      return new Response(JSON.stringify({ analytics: "off" }), { status: 200, headers });
    }

    if (request.method === "PUT") {
      const headers = new Headers({ "content-type": "application/json" });
      for (const v of optInCookies()) headers.append("set-cookie", v);
      return new Response(JSON.stringify({ analytics: "on" }), { status: 200, headers });
    }

    if (request.method !== "POST") return new Response(null, { status: 405 });
    if (!c) return new Response(null, { status: 204 });

    let body: unknown;
    try {
      body = JSON.parse(await request.text());
    } catch {
      return new Response(null, { status: 204 });
    }

    try {
      const { setCookie } = await collect(
        body,
        request.headers,
        request.headers.get("cookie") || "",
        c,
        // A Worker can finish the forward after the visitor already has their
        // 204, which is the cheapest possible version of this.
        (p) => ctx.waitUntil(p),
      );
      const headers = new Headers();
      if (setCookie) headers.append("set-cookie", setCookie);
      return new Response(null, { status: 204, headers });
    } catch {
      return new Response(null, { status: 204 });
    }
  },
};
