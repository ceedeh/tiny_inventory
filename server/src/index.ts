import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createApp } from './app';
import { Config } from './config';
import { getDB, ProductRepository, seedDB, StoreRepository } from './db';
import { Logger } from './shared/logger';

async function startServer() {
  const config = new Config();
  const logger = new Logger(config);

  const db = getDB();
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  logger.info('Database migrations applied');

  await seedDB(db);
  logger.info('Database seeding completed');

  const storeRepository = new StoreRepository(db);
  const productRepository = new ProductRepository(db);

  const app = createApp({
    config,
    logger,
    repositories: {
      storeRepository,
      productRepository,
    },
  });

  const server = app.listen(config.getPort(), () => {
    logger.info(`Server running on port ${config.getPort()} in ${config.getNodeEnv()} mode`);
    logger.info(`Health check: http://localhost:${config.getPort()}/api/v1/health`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();
