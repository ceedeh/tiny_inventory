import { Store } from '@/db/models';
import { BaseFilter, PaginatedResponse } from '@/shared/types';

export interface IStoreRepository {
  find(filter: BaseFilter): Promise<PaginatedResponse<Store>>;
  findById(id: string): Promise<Store | null>;
  create(data: Store): Promise<Store>;
  update(id: string, data: Partial<Store>): Promise<Store | null>;
  delete(id: string): Promise<void>;
  getStoreCount(): Promise<number>;
}
