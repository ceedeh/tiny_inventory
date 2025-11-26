import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Config } from './config';
import { requestLogger, errorHandler } from './shared/middleware';
import { Logger } from './shared/logger';
import { IProductRepository, IStoreRepository } from './db';
import { ProductService, StoreService, AnalyticsService } from './core/services';
import { ProductRouter, StoreRouter, AnalyticsRouter } from './api';

interface AppOptions {
  config: Config;
  logger: Logger;
  repositories: {
    storeRepository: IStoreRepository;
    productRepository: IProductRepository;
  };
}

export function createApp(opts: AppOptions): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: opts.config.getRateLimitWindowMs(),
    max: opts.config.getRateLimitMaxRequests(),
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api', limiter);

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(requestLogger(opts.logger));

  const storeService = new StoreService(opts.repositories.storeRepository, opts.logger);
  const productService = new ProductService(
    opts.repositories.productRepository,
    opts.repositories.storeRepository,
    opts.logger
  );
  const analyticsService = new AnalyticsService(opts.repositories.productRepository, opts.logger);

  const storeRouter = new StoreRouter(storeService);
  const productRouter = new ProductRouter(productService);
  const analyticsRouter = new AnalyticsRouter(analyticsService);

  app.use(`/api/v1/${storeRouter.path}`, storeRouter.setup());
  app.use(`/api/v1/${productRouter.path}`, productRouter.setup());
  app.use(`/api/v1/${analyticsRouter.path}`, analyticsRouter.setup());
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // Error handling
  app.use(errorHandler);
  app.use((_req, res, _next) => {
    res.status(404).json({
      success: false,
      message: 'Not found',
    });
  });

  return app;
}
