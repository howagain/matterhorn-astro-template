import { defineDb, defineTable, column, NOW } from "astro:db";

// https://astro.build/db/config
export const Todos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    completed: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { Todos },
});
