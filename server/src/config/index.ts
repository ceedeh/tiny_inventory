import dotenv from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

dotenv.config({
  path: resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env'),
});

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().positive(),
  DSN: z.string().url(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive(),
  LOW_STOCK_THRESHOLD: z.coerce.number().int().nonnegative(),
});

export class Config {
  private nodeEnv: string;
  private port: number;
  private dsn: string;
  private logLevel: string;
  private rateLimitWindowMs: number;
  private rateLimitMaxRequests: number;
  private lowStockThreshold: number;

  constructor() {
    const config = this.validateConfig();

    this.nodeEnv = config.NODE_ENV;
    this.port = config.PORT;
    this.dsn = config.DSN;
    this.logLevel = config.LOG_LEVEL;
    this.rateLimitWindowMs = config.RATE_LIMIT_WINDOW_MS;
    this.rateLimitMaxRequests = config.RATE_LIMIT_MAX_REQUESTS;
    this.lowStockThreshold = config.LOW_STOCK_THRESHOLD;
  }

  private validateConfig(): z.infer<typeof configSchema> {
    const { data, error } = configSchema.safeParse(process.env);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return data!;
  }

  getNodeEnv(): string {
    return this.nodeEnv;
  }

  getPort(): number {
    return this.port;
  }

  getDsn(): string {
    return this.dsn;
  }

  getLogLevel(): string {
    return this.logLevel;
  }

  getRateLimitWindowMs(): number {
    return this.rateLimitWindowMs;
  }

  getRateLimitMaxRequests(): number {
    return this.rateLimitMaxRequests;
  }

  getLowStockThreshold(): number {
    return this.lowStockThreshold;
  }
}
