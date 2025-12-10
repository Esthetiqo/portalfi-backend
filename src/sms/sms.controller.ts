import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SmsSenderService } from './sms.service';
import { TestSmsDto } from './dto/test-sms.dto';
import { OtpSmsDto } from './dto/otp-sms.dto';

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsSenderService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a test SMS with arbitrary message' })
  @ApiBody({ type: TestSmsDto })
  @ApiResponse({ status: 200, description: 'Message sent' })
  async sendTest(@Body() body: TestSmsDto) {
    const result = await this.smsService.sendTestSms(body.to, body.message);
    return { success: true, sid: result.sid };
  }

  @Post('otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an OTP SMS using i18n template' })
  @ApiBody({ type: OtpSmsDto })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async sendOtp(@Body() body: OtpSmsDto) {
    const result = await this.smsService.sendOtpSms(
      body.to,
      body.code,
      body.purpose ?? 'generic',
      body.language,
    );
    return { success: true, sid: result.sid };
  }
}
