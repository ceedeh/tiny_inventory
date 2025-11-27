import { IProductRepository, IStoreRepository } from '@/db';
import { Product } from '@/db/models';
import { ProductFilter, PaginatedResponse } from '@/shared/types';
import { faker } from '@faker-js/faker';

export class ProductsRepositoryMock implements IProductRepository {
  private products: Map<string, Product> = new Map();
  private storeRepository: IStoreRepository | null = null;

  setStoreRepository(storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  async find(filters: ProductFilter): Promise<PaginatedResponse<Product>> {
    let productsArray = Array.from(this.products.values());

    // Apply filters
    if (filters.storeId) {
      productsArray = productsArray.filter((p) => p.storeId === filters.storeId);
    }
    if (filters.category) {
      productsArray = productsArray.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice !== undefined) {
      productsArray = productsArray.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      productsArray = productsArray.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.minStock !== undefined) {
      productsArray = productsArray.filter((p) => p.quantity >= filters.minStock!);
    }
    if (filters.maxStock !== undefined) {
      productsArray = productsArray.filter((p) => p.quantity <= filters.maxStock!);
    }

    const offset = (filters.page - 1) * filters.limit;
    const paginatedData = productsArray.slice(offset, offset + filters.limit);

    // Populate store data for each product
    const productsWithStore = await Promise.all(
      paginatedData.map(async (product) => {
        if (this.storeRepository) {
          const store = await this.storeRepository.findById(product.storeId);
          return new Product({ ...product, store: store || undefined });
        }
        return product;
      })
    );

    return {
      data: productsWithStore,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: productsArray.length,
        totalPages: Math.ceil(productsArray.length / filters.limit),
      },
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;

    // Populate store data
    if (this.storeRepository) {
      const store = await this.storeRepository.findById(product.storeId);
      return new Product({ ...product, store: store || undefined });
    }
    return product;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = Array.from(this.products.values()).find((p) => p.sku === sku);
    if (!product) return null;

    // Populate store data
    if (this.storeRepository) {
      const store = await this.storeRepository.findById(product.storeId);
      return new Product({ ...product, store: store || undefined });
    }
    return product;
  }

  async create(data: Product): Promise<Product> {
    const product = new Product({
      ...data,
      id: data.id || this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.products.set(product.id, product);
    return product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;

    const updatedProduct = new Product({
      ...product,
      ...data,
      id: product.id,
      updatedAt: new Date(),
    });
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }

  async countProductsByCategoryForStore(
    storeId: string
  ): Promise<Array<{ category: string; products: number }>> {
    const categoryProductCounts = new Map<string, number>();

    for (const product of this.products.values()) {
      if (product.storeId === storeId) {
        const count = categoryProductCounts.get(product.category) || 0;
        categoryProductCounts.set(product.category, count + 1);
      }
    }

    return Array.from(categoryProductCounts.entries()).map(([category, products]) => ({
      category,
      products,
    }));
  }

  async getProductCount(): Promise<number> {
    return this.products.size;
  }

  async getAverageProductCount(): Promise<number> {
    if (!this.storeRepository) return 0;

    const totalProducts = this.products.size;
    const totalStores = await this.storeRepository.getStoreCount();

    if (totalStores === 0) return 0;

    return Math.floor(totalProducts / totalStores);
  }

  // Test helper methods
  clear(): void {
    this.products.clear();
  }

  private generateId(): string {
    return faker.string.uuid();
  }
}
