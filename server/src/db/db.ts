import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as relations from './tables/relations';
import { products, stores } from './tables';

const schema = {
  ...relations,
  products,
  stores,
};

export type Database = NodePgDatabase<typeof schema>;

let db: Database | null = null;

export const getDB = (): Database => {
  if (db) {
    return db;
  }

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: process.env.DSN!,
  });

  db = drizzle({
    client: pool,
    casing: 'snake_case',
    schema,
  });
  return db;
};
