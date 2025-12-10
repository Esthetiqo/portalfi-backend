import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsController } from './sms.controller';
import { SmsSenderService } from './sms.service';

@Module({
  imports: [ConfigModule],
  controllers: [SmsController],
  providers: [SmsSenderService],
  exports: [SmsSenderService],
})
export class SmsModule {}
