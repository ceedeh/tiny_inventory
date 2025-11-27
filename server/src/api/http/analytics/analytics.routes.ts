import express from 'express';
import { AnalyticsHandlers } from './analytics.handlers';
import { AnalyticsService } from '@/core/services';
import { promisifyHandler } from '@/api/promisify_handler';

export class AnalyticsRouter {
  public path = 'analytics';
  private handlers: AnalyticsHandlers;

  constructor(private readonly analyticsService: AnalyticsService) {
    this.handlers = new AnalyticsHandlers(this.analyticsService);
  }

  setup() {
    const r = express.Router();

    r.get('/products-stores', promisifyHandler(this.handlers.productsAnalytics));
    r.get(
      '/stores/:storeId/products-by-category',
      promisifyHandler(this.handlers.countProductsByCategoryForStore)
    );

    return r;
  }
}
