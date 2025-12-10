import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.warn(
        '⚠️  Database connection failed - Running without database',
      );
      this.logger.warn(
        '   Database logging is disabled. GnosisPay endpoints will work normally.',
      );
      this.connected = false;
      // Don't throw - allow app to start without database
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.$disconnect();
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
