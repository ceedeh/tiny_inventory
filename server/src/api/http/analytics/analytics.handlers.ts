import { Request, Response } from 'express';
import { AnalyticsService } from '@/core/services';

export class AnalyticsHandlers {
  constructor(private readonly analyticsService: AnalyticsService) {
    this.productsAnalytics = this.productsAnalytics.bind(this);
    this.countProductsByCategoryForStore = this.countProductsByCategoryForStore.bind(this);
  }

  async productsAnalytics(_: Request, __: Response) {
    try {
      return await this.analyticsService.productsAnalytics();
    } catch (err) {
      throw err;
    }
  }

  async countProductsByCategoryForStore(req: Request, _: Response) {
    try {
      const storeId = req.params.storeId;
      return await this.analyticsService.countProductsByCategoryForStore(storeId);
    } catch (err) {
      throw err;
    }
  }
}
