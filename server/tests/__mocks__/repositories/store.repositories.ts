import { IStoreRepository } from '@/db';
import { Store } from '@/db/models';
import { BaseFilter, PaginatedResponse } from '@/shared/types';
import { faker } from '@faker-js/faker';

export class StoreRepositoryMock implements IStoreRepository {
  private stores: Map<string, Store> = new Map();

  async find(filter: BaseFilter): Promise<PaginatedResponse<Store>> {
    const storesArray = Array.from(this.stores.values());
    const offset = (filter.page - 1) * filter.limit;
    const paginatedData = storesArray.slice(offset, offset + filter.limit);

    return {
      data: paginatedData,
      pagination: {
        page: filter.page,
        limit: filter.limit,
        total: storesArray.length,
        totalPages: Math.ceil(storesArray.length / filter.limit),
      },
    };
  }

  async findById(id: string): Promise<Store | null> {
    return this.stores.get(id) || null;
  }

  async create(data: Store): Promise<Store> {
    const store = new Store({
      ...data,
      id: data.id || this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.stores.set(store.id, store);
    return store;
  }

  async update(id: string, data: Partial<Store>): Promise<Store | null> {
    const store = this.stores.get(id);
    if (!store) return null;

    const updatedStore = new Store({
      ...store,
      ...data,
      id: store.id,
      updatedAt: new Date(),
    });
    this.stores.set(id, updatedStore);
    return updatedStore;
  }

  async delete(id: string): Promise<void> {
    this.stores.delete(id);
  }

  // Test helper methods
  clear(): void {
    this.stores.clear();
  }

  private generateId(): string {
    return faker.string.uuid();
  }
}
