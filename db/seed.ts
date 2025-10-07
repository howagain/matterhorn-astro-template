import { db, Todos } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Todos).values([
    { title: "Learn Astro DB", completed: false },
    { title: "Build Docker image", completed: true },
  ]);
}
