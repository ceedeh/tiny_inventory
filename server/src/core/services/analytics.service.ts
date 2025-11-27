import { IProductRepository, IStoreRepository } from '@/db';
import { Logger } from '@/shared/logger';

export class AnalyticsService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storeRepository: IStoreRepository,
    private readonly logger: Logger
  ) {}

  async productsAnalytics() {
    this.logger.info('Fetching products analytics');

    const [productCount, averageProductCount, storeCount] = await Promise.all([
      this.productRepository.getProductCount(),
      this.productRepository.getAverageProductCount(),
      this.storeRepository.getStoreCount(),
    ]);

    return {
      productCount,
      averageProductCount,
      storeCount,
    };
  }

  async countProductsByCategoryForStore(storeId: string) {
    this.logger.info(`Fetching products by category for store: ${storeId}`);

    return this.productRepository.countProductsByCategoryForStore(storeId);
  }
}
