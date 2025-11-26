import { resolve } from 'path';
import { config as loadEnv } from 'dotenv';
import { createApp } from '@/app';
import { ProductsRepositoryMock, StoreRepositoryMock } from './__mocks__/repositories';
import { Logger } from '@/shared/logger';
import { Config } from '@/config';

// Load test environment variables
loadEnv({ path: resolve(__dirname, '../.env.test') });

export const setupApp = () => {
  const productRepository = new ProductsRepositoryMock();
  const storeRepository = new StoreRepositoryMock();

  // Link repositories so products can include store data
  productRepository.setStoreRepository(storeRepository);

  const config = new Config();
  const logger = new Logger(config);
  const app = createApp({
    config,
    logger,
    repositories: {
      productRepository,
      storeRepository,
    },
  });

  return { app, productRepository, storeRepository };
};
