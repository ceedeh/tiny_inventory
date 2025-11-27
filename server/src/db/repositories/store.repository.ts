import { count, desc, eq } from 'drizzle-orm';
import { IStoreRepository } from './interfaces';
import { BaseFilter, PaginatedResponse } from '@/shared/types';
import { getPaginationOffset } from '@/shared/utils';
import { Store } from '../models';
import { stores as storesTable } from '../tables';
import { Database } from '../db';

export class StoreRepository implements IStoreRepository {
  constructor(private db: Database) {
    this.db = db;
  }

  async find(filter: BaseFilter): Promise<PaginatedResponse<Store>> {
    const offset = getPaginationOffset(filter.page, filter.limit);

    const stores = await this.db
      .select()
      .from(storesTable)
      .orderBy(desc(storesTable.createdAt))
      .offset(offset)
      .limit(filter.limit)
      .then((stores) => stores.map((store) => new Store(store)));

    const total = await this.db
      .select({ count: count() })
      .from(storesTable)
      .then((res) => Number(res[0].count) || 0);

    return {
      data: stores,
      pagination: {
        page: filter.page,
        limit: filter.limit,
        total,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.db
      .select()
      .from(storesTable)
      .where(eq(storesTable.id, id))
      .then((stores) => stores[0]);

    return store ? new Store(store) : null;
  }

  async create(data: Store): Promise<Store> {
    const [store] = await this.db.insert(storesTable).values(data).returning();

    return new Store(store);
  }

  async update(id: string, data: Partial<Store>): Promise<Store | null> {
    const [store] = await this.db
      .update(storesTable)
      .set(data)
      .where(eq(storesTable.id, id))
      .returning();

    return store ? new Store(store) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(storesTable).where(eq(storesTable.id, id));
  }

  async getStoreCount(): Promise<number> {
    const total = await this.db.$count(storesTable);
    return total;
  }
}
