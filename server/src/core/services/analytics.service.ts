import { IProductRepository } from '@/db';
import { Logger } from '@/shared/logger';

export class AnalyticsService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly logger: Logger
  ) {}

  async countProductsByStore() {
    this.logger.info('Fetching products grouped by store');

    return this.productRepository.countProductsByStore();
  }

  async countProductsByCategoryForStore(storeId: string) {
    this.logger.info(`Fetching products by category for store: ${storeId}`);

    return this.productRepository.countProductsByCategoryForStore(storeId);
  }
}
