export const prerender = false;

import type { APIRoute } from "astro";
import { db, Todos as TodosTable, desc } from "astro:db";

export const GET: APIRoute = async () => {
  const todos = await db
    .select()
    .from(TodosTable)
    .orderBy(desc(TodosTable.createdAt));
  return new Response(JSON.stringify(todos), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let title = "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    title = String(body?.title || "").trim();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    title = String(form.get("title") || "").trim();
  }

  if (!title) {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  await db.insert(TodosTable).values({ title, completed: false });
  // Return 201 and let client refetch list
  return new Response(null, { status: 201 });
};
