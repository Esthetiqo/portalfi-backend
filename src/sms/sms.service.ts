import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { createSmsI18n } from '../common/lib/i18n/config';
import { normalizeLanguage } from '../common/lib/i18n/utils';

@Injectable()
export class SmsSenderService {
  private twilioClient?: Twilio;

  constructor(private readonly configService: ConfigService) {}

  private getClient(): Twilio {
    if (this.twilioClient) return this.twilioClient;

    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    this.twilioClient = new Twilio(accountSid, authToken);
    return this.twilioClient;
  }

  async sendTestSms(to: string, message: string): Promise<{ sid: string }> {
    const client = this.getClient();
    const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    if (!fromNumber) throw new Error('TWILIO_PHONE_NUMBER not configured');

    const msg = await client.messages.create({
      to,
      from: fromNumber,
      body: message,
    });

    return { sid: msg.sid };
  }

  async sendOtpSms(
    to: string,
    code: string,
    purpose:
      | 'generic'
      | 'login'
      | 'registration'
      | 'password_reset' = 'generic',
    language?: string,
  ): Promise<{ sid: string }> {
    const client = this.getClient();
    const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    if (!fromNumber) throw new Error('TWILIO_PHONE_NUMBER not configured');

    const appName = this.configService.get<string>('APP_NAME', 'Portalfi');
    const minutes = this.configService.get<string>('OTP_EXPIRY_MINUTES', '10');
    const lng = normalizeLanguage(language);
    const i18n = await createSmsI18n(lng);

    const key: `otp.${string}` =
      purpose === 'login' ||
      purpose === 'registration' ||
      purpose === 'password_reset'
        ? (`otp.${purpose}` as const)
        : 'otp.generic';

    const body = i18n.t(key, { appName, code, minutes });

    const msg = await client.messages.create({
      to,
      from: fromNumber,
      body,
    });

    return { sid: msg.sid };
  }
}
