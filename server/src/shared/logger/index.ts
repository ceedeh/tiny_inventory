import { Config } from '@/config';
import pino from 'pino';

export class Logger {
  private logger: pino.Logger;

  constructor(private config: Config) {
    this.logger = pino({
      level: this.config.getLogLevel(),
      serializers: {
        err: pino.stdSerializers.err,
      },
    });
  }

  fatal(message: string, meta?: any) {
    this.logger.fatal(meta, message);
  }

  error(message: string, meta?: any) {
    this.logger.error(meta, message);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(meta, message);
  }

  info(message: string, meta?: any) {
    this.logger.info(meta, message);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(meta, message);
  }

  trace(message: string, meta?: any) {
    this.logger.trace(meta, message);
  }
}
