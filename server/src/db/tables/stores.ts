import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { generateUUID } from '@/shared/utils';

export const stores = pgTable(
  'stores',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    createdAt: timestamp()
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('store_name_idx').on(table.name)]
);

export const selectStoreSchema = createSelectSchema(stores);

export type Store = typeof stores.$inferSelect;
