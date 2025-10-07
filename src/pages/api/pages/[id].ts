export const prerender = false;

import type { APIRoute } from "astro";
import { db, DealerPages as DealerPagesTable, eq } from "astro:db";

// GET /api/pages/:dealer_id -> get dealer page config
export const GET: APIRoute = async ({ params }) => {
  const dealerId = String(params.id || "").trim();
  if (!dealerId) return new Response(null, { status: 400 });
  const rows = await db
    .select()
    .from(DealerPagesTable)
    .where(eq(DealerPagesTable.dealerId, dealerId));
  const first = rows[0];
  if (!first) return new Response(JSON.stringify(null), { status: 200, headers: { "content-type": "application/json" } });
  const config = { ...first, layoutJson: JSON.parse(first.layoutJson) };
  return new Response(JSON.stringify(config), { status: 200, headers: { "content-type": "application/json" } });
};

// POST /api/pages/:dealer_id -> create or update dealer page config
export const POST: APIRoute = async ({ params, request }) => {
  const dealerId = String(params.id || "").trim();
  if (!dealerId) return new Response(null, { status: 400 });
  const body = await request.json().catch(() => ({}));
  const id = body?.id ? String(body.id) : "";
  const layoutJson = body?.layout_json ?? body?.layoutJson ?? {};
  const payload = {
    dealerId,
    layoutJson: JSON.stringify(layoutJson),
    updatedAt: new Date(),
  } as Record<string, unknown>;

  if (id) {
    await db.update(DealerPagesTable).set(payload).where(eq(DealerPagesTable.id, id));
    return new Response(null, { status: 204 });
  }

  const newId = crypto.randomUUID();
  await db.insert(DealerPagesTable).values({ id: newId, createdAt: new Date(), ...(payload as any) });
  return new Response(JSON.stringify({ id: newId }), { status: 201, headers: { "content-type": "application/json" } });
};

