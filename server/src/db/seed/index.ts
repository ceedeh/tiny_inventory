import { faker } from '@faker-js/faker';
import { Database } from '../db';
import { stores as storesTable, products as productsTable } from '../tables';

/**
 * Seed the database with initial data if empty. Creates 10 stores,
 * and for each store, creates 10 products.
 */
export const seedDB = async (db: Database) => {
  const count = await db.$count(storesTable);
  if (count > 0) {
    return;
  }

  const stores = Array.from({ length: 10 }).map(() => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
  }));

  const storeIDS = await Promise.all(
    stores.map((store) =>
      db
        .insert(storesTable)
        .values(store)
        .returning()
        .then(([s]) => s.id)
    )
  );

  await Promise.all(
    storeIDS.map(async (storeId) => {
      const products = Array.from({ length: 10 }).map(() => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: Math.round(parseFloat(faker.commerce.price()) * 100),
        category: faker.commerce.department(),
        quantity: faker.number.int({ min: 1, max: 100 }),
        storeId,
      }));

      await db.insert(productsTable).values(products);
    })
  );
};
