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

// Coupons table for Dealer Coupon Builder POC
export const Coupons = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    dealerId: column.text(),
    title: column.text(),
    description: column.text(),
    discountAmount: column.text(),
    expirationDate: column.text(),
    buttonText: column.text(),
    buttonColor: column.text(),
    backgroundImage: column.text(),
    layout: column.text(),
    // Store JSON as string for portability; parse/stringify in app layer
    customFields: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

// Optional: DealerPages to support future nested layouts via layout_json
export const DealerPages = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    dealerId: column.text(),
    layoutJson: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { Todos, Coupons, DealerPages },
});
