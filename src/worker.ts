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
    returning: env.BZ_RETURNING !== "off",
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

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
