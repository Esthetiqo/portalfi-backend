import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';

@ApiTags('GnosisPay - Phone Verification')
@Controller('api/v1/verification')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayVerificationController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Post()
  @ApiOperation({ summary: 'Request phone verification OTP' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully to phone number',
    schema: {
      properties: {
        success: { type: 'boolean', description: 'Whether OTP was sent successfully' },
        message: { type: 'string', description: 'Status message' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid phone number format' })
  @ApiResponse({ status: 429, description: 'Too many requests - rate limit exceeded' })
  async requestVerificationOtp(
    @GnosisPayToken() token: string,
    @Body() body: { phoneNumber: string },
  ): Promise<void> {
    await this.httpService.requestVerificationOtp(token, body.phoneNumber);
  }

  @Post('check')
  @ApiOperation({ summary: 'Verify phone number with OTP code' })
  @ApiResponse({
    status: 200,
    description: 'Phone verified successfully',
    schema: {
      properties: {
        success: { type: 'boolean', description: 'Whether verification succeeded' },
        verified: { type: 'boolean', description: 'Phone verification status' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP code' })
  @ApiResponse({ status: 404, description: 'No pending verification found' })
  async verifyPhoneWithOtp(
    @GnosisPayToken() token: string,
    @Body() body: { code: string },
  ): Promise<void> {
    await this.httpService.verifyPhoneWithOtp(token, body.code);
  }
}
