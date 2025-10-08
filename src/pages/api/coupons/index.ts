export const prerender = false;

import type { APIRoute } from "astro";

// Provide a tiny index to indicate usage
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ usage: "/api/coupons/:dealer_id for list/create-update, /api/coupons/:coupon_id for delete" }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
};

