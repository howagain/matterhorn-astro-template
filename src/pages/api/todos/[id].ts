export const prerender = false;

import type { APIRoute } from "astro";
import { db, Todos as TodosTable, eq } from "astro:db";

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(null, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.completed === "boolean") updates.completed = body.completed;

  if (Object.keys(updates).length === 0)
    return new Response(null, { status: 204 });

  await db.update(TodosTable).set(updates).where(eq(TodosTable.id, id));
  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(null, { status: 400 });
  await db.delete(TodosTable).where(eq(TodosTable.id, id));
  return new Response(null, { status: 204 });
};
