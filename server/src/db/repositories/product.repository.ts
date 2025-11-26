import { and, desc, eq, gte, lte, SQL, sql } from 'drizzle-orm';
import { getPaginationOffset } from '@/shared/utils';
import { ProductFilter, PaginatedResponse } from '@/shared/types';
import { IProductRepository } from './interfaces';
import { Product } from '../models';
import { products as productsTable } from '../tables';
import { Database } from '../db';

export class ProductRepository implements IProductRepository {
  constructor(private db: Database) {
    this.db = db;
  }

  async find(filters: ProductFilter): Promise<PaginatedResponse<Product>> {
    const offset = getPaginationOffset(filters.page, filters.limit);
    const conditions: SQL[] = [];

    if (filters.storeId) {
      conditions.push(eq(productsTable.storeId, filters.storeId));
    }
    if (filters.category) {
      conditions.push(eq(productsTable.category, filters.category));
    }
    if (filters.minPrice) {
      conditions.push(gte(productsTable.price, filters.minPrice));
    }
    if (filters.maxPrice) {
      conditions.push(lte(productsTable.price, filters.maxPrice));
    }
    if (filters.minStock) {
      conditions.push(gte(productsTable.quantity, filters.minStock));
    }
    if (filters.maxStock) {
      conditions.push(lte(productsTable.quantity, filters.maxStock));
    }

    const [total, products] = await Promise.all([
      this.db.$count(productsTable, and(...conditions)),
      this.db.query.products.findMany({
        where: and(...conditions),
        limit: filters.limit,
        offset,
        orderBy: desc(productsTable.createdAt),
        with: { store: true },
      }),
    ]);

    return {
      data: products.map((product) => new Product(product)),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.query.products.findFirst({
      where: eq(productsTable.id, id),
      with: { store: true },
    });

    return product ? new Product(product) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.db.query.products.findFirst({
      where: eq(productsTable.sku, sku),
      with: { store: true },
    });

    return product ? new Product(product) : null;
  }

  async create(data: Product): Promise<Product> {
    const [createdProduct] = await this.db.insert(productsTable).values(data).returning();

    return new Product(createdProduct);
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const [updatedProduct] = await this.db
      .update(productsTable)
      .set(data)
      .where(eq(productsTable.id, id))
      .returning();

    return updatedProduct ? new Product(updatedProduct) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(productsTable).where(eq(productsTable.id, id));
  }

  async getTotalInventoryValueByStore(storeId: string): Promise<number> {
    const total = await this.db
      .select({
        totalValue: sql<number>`SUM(${productsTable.price} * ${productsTable.quantity})`,
      })
      .from(productsTable)
      .where(eq(productsTable.storeId, storeId))
      .limit(1)
      .then((res) => res[0]?.totalValue || 0);

    return total;
  }

  async getLowStockProducts(threshold: number): Promise<PaginatedResponse<Product>> {
    const products = await this.db.query.products.findMany({
      where: lte(productsTable.quantity, threshold),
      orderBy: desc(productsTable.quantity),
      with: { store: true },
    });

    return {
      data: products.map((product) => new Product(product)),
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        totalPages: 1,
      },
    };
  }

  async countProductsByStore(): Promise<Array<{ storeId: string; products: number }>> {
    const result = await this.db
      .select({
        storeId: productsTable.storeId,
        products: sql<number>`COUNT(*)::int`,
      })
      .from(productsTable)
      .groupBy(productsTable.storeId);

    return result;
  }

  async countProductsByCategoryForStore(
    storeId: string
  ): Promise<Array<{ category: string; products: number }>> {
    const result = await this.db
      .select({
        category: productsTable.category,
        products: sql<number>`COUNT(*)::int`,
      })
      .from(productsTable)
      .where(eq(productsTable.storeId, storeId))
      .groupBy(productsTable.category);

    return result;
  }
}
