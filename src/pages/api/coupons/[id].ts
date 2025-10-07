export const prerender = false;

import type { APIRoute } from "astro";
import { db, Coupons as CouponsTable, desc, eq } from "astro:db";

// GET /api/coupons/:dealer_id -> list coupons for dealer
export const GET: APIRoute = async ({ params }) => {
  const dealerId = String(params.id || "").trim();
  if (!dealerId) return new Response(null, { status: 400 });
  const coupons = await db
    .select()
    .from(CouponsTable)
    .where(eq(CouponsTable.dealerId, dealerId))
    .orderBy(desc(CouponsTable.createdAt));

  const parsed = coupons.map((c) => ({
    ...c,
    customFields: c.customFields ? JSON.parse(c.customFields) : undefined,
  }));

  return new Response(JSON.stringify(parsed), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

// POST /api/coupons/:dealer_id -> create or update a coupon for dealer
// Body: JSON with coupon fields. If id present, update; else create.
export const POST: APIRoute = async ({ params, request }) => {
  const dealerId = String(params.id || "").trim();
  if (!dealerId) return new Response(null, { status: 400 });

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Expected application/json" }), {
      status: 415,
      headers: { "content-type": "application/json" },
    });
  }

  const body = await request.json().catch(() => ({}));

  const id = body?.id ? String(body.id).trim() : "";
  const payload = {
    dealerId,
    title: String(body?.title ?? "").trim(),
    description: String(body?.description ?? "").trim(),
    discountAmount: String(body?.discount_amount ?? body?.discountAmount ?? "").trim(),
    expirationDate: String(body?.expiration_date ?? body?.expirationDate ?? "").trim(),
    buttonText: String(body?.button_text ?? body?.buttonText ?? "").trim(),
    buttonColor: String(body?.button_color ?? body?.buttonColor ?? "").trim(),
    backgroundImage: String(body?.background_image ?? body?.backgroundImage ?? "").trim(),
    layout: String(body?.layout ?? "horizontal").trim(),
    customFields: body?.custom_fields
      ? JSON.stringify(body.custom_fields)
      : body?.customFields
      ? JSON.stringify(body.customFields)
      : undefined,
    updatedAt: new Date(),
  } as Record<string, unknown>;

  // Basic validation for required fields when creating
  if (!id) {
    if (!payload.title || !payload.layout) {
      return new Response(JSON.stringify({ error: "title and layout are required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
  }

  if (id) {
    // Update existing coupon
    await db.update(CouponsTable).set(payload).where(eq(CouponsTable.id, id));
    return new Response(null, { status: 204 });
  }

  // Create new coupon with generated id
  const newId = crypto.randomUUID();
  await db.insert(CouponsTable).values({
    id: newId,
    createdAt: new Date(),
    ...(payload as any),
  });
  return new Response(JSON.stringify({ id: newId }), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
};

// DELETE /api/coupons/:coupon_id -> delete a coupon by id
export const DELETE: APIRoute = async ({ params }) => {
  const id = String(params.id || "").trim();
  if (!id) return new Response(null, { status: 400 });
  await db.delete(CouponsTable).where(eq(CouponsTable.id, id));
  return new Response(null, { status: 204 });
};

