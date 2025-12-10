import { Controller, Post, Body, Get, UseGuards, Header } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GnosisPayAuthService } from '../services/gnosispay-auth.service';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { VerifyChallengeDto, SignupDto } from '../dto/auth.dto';
import {
  GnosisPayAuthGuard,
  Public,
} from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';

@ApiTags('GnosisPay - Authentication')
@Controller('api/v1/auth')
@UseGuards(GnosisPayAuthGuard)
export class GnosisPayAuthController {
  constructor(
    private readonly gnosisPayAuthService: GnosisPayAuthService,
    private readonly gnosisPayHttpService: GnosisPayHttpService,
  ) {}

  @Get('nonce')
  @Public()
  @ApiOperation({ summary: 'Generate nonce for SIWE authentication' })
  @ApiResponse({
    status: 200,
    description: 'Nonce generated successfully',
    schema: { type: 'string', example: 'a1b2c3d4e5f6' },
  })
  @Header('Content-Type', 'text/plain')
  async generateNonce(): Promise<string> {
    return await this.gnosisPayHttpService.generateNonce();
  }

  @Post('challenge')
  @Public()
  @ApiOperation({ summary: 'Verify SIWE signature and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Signature verified, token returned',
    schema: { properties: { token: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async verifyChallenge(
    @Body() dto: VerifyChallengeDto,
  ): Promise<{ token: string }> {
    const response = await this.gnosisPayHttpService.verifyChallenge(
      dto.message,
      dto.signature,
      dto.ttlInSeconds,
    );
    return { token: response.token };
  }

  @Post('signup')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new GnosisPay user account' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid partner ID' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiResponse({
    status: 409,
    description: 'Email or wallet already registered',
  })
  async signup(
    @GnosisPayToken() token: string,
    @Body() dto: SignupDto,
  ): Promise<{ id: string; token: string; hasSignedUp: boolean }> {
    return await this.gnosisPayAuthService.signupUser(
      token,
      dto.authEmail,
      dto.otp,
      dto.referralCouponCode,
      dto.marketingCampaign,
      dto.partnerId,
    );
  }

  // ===== HIGH PRIORITY SIGNUP OTP ENDPOINT =====
  @Post('signup/otp')
  @Public()
  @ApiOperation({
    summary: 'Request OTP code for email verification during signup',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully to email' })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  @ApiResponse({
    status: 429,
    description: 'Too many requests, try again later',
  })
  async requestSignupOtp(@Body() body: { email: string }): Promise<void> {
    await this.gnosisPayHttpService.requestSignupOtp(body.email);
  }
}
