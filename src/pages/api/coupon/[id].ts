export const prerender = false;

import type { APIRoute } from "astro";
import { db, Coupons as CouponsTable, eq } from "astro:db";

// GET /api/coupon/:id -> fetch coupon by id
export const GET: APIRoute = async ({ params }) => {
  const id = String(params.id || "").trim();
  if (!id) return new Response(null, { status: 400 });
  const rows = await db.select().from(CouponsTable).where(eq(CouponsTable.id, id));
  const c = rows[0];
  if (!c) return new Response(JSON.stringify(null), { status: 200, headers: { "content-type": "application/json" } });
  const parsed = { ...c, customFields: c.customFields ? JSON.parse(c.customFields) : undefined };
  return new Response(JSON.stringify(parsed), { status: 200, headers: { "content-type": "application/json" } });
};

