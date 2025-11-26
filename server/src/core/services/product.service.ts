import { Product, IProductRepository, IStoreRepository } from '@/db';
import { BadRequestException, NotFoundException } from '@/shared/errors';
import { Logger } from '@/shared/logger';
import { ProductFilter } from '@/shared/types';

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storeRepository: IStoreRepository,
    private readonly logger: Logger
  ) {}

  async createProduct(data: Product) {
    this.logger.info('Creating a new product', data);

    if (!(await this.storeRepository.findById(data.storeId))) {
      throw new NotFoundException('Store does not exist');
    }

    if (await this.productRepository.findBySku(data.sku)) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    return this.productRepository.create(data);
  }

  async updateProduct(id: string, data: Partial<Product>) {
    this.logger.info(`Updating product with id: ${id}`, data);

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (data.sku && data.sku !== existingProduct.sku) {
      if (await this.productRepository.findBySku(data.sku)) {
        throw new BadRequestException('Another product with this SKU already exists');
      }
    }

    if (data.storeId && data.storeId !== existingProduct.storeId) {
      if (!(await this.storeRepository.findById(data.storeId))) {
        throw new NotFoundException('Store does not exist');
      }
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    this.logger.info(`Deleting product with id: ${id}`);

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete(id);
  }

  async getProducts(filters: ProductFilter) {
    this.logger.info('Fetching products with filters', filters);

    return this.productRepository.find(filters);
  }

  async getProductById(id: string) {
    this.logger.info(`Fetching product with id: ${id}`);

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
