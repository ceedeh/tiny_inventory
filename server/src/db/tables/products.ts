import { index, integer, pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { generateUUID } from '@/shared/utils';
import { stores } from './stores';

export const products = pgTable(
  'products',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    sku: varchar({ length: 50 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    category: varchar({ length: 100 }).notNull(),
    price: integer().notNull(),
    quantity: integer().notNull().default(0),
    storeId: uuid()
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    description: text(),
    createdAt: timestamp()
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('product_store_idx').on(table.storeId),
    index('product_category_idx').on(table.category),
    index('product_quantity_idx').on(table.quantity),
  ]
);

export const selectProductSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
