import { Product } from '@/db/models';
import { PaginatedResponse, ProductFilter } from '@/shared/types';

export interface IProductRepository {
  find(filters: ProductFilter): Promise<PaginatedResponse<Product>>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  create(data: Product): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<void>;
  countProductsByStore(): Promise<Array<{ storeId: string; products: number }>>;
  countProductsByCategoryForStore(
    storeId: string
  ): Promise<Array<{ category: string; products: number }>>;
}
