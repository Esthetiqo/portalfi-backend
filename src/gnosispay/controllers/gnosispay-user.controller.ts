import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { UpdateUserDto } from '../../common/dto/gnosispay-base.dto';
import { VerifyPhoneDto, VerifyPhoneOtpDto } from '../dto/kyc.dto';
import { User } from '../types';

@ApiTags('GnosisPay - User Management')
@Controller('api/v1/user')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayUserController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUser(@GnosisPayToken() token: string): Promise<User> {
    return await this.httpService.getUser(token);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUser(
    @GnosisPayToken() token: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.httpService.updateUser(token, dto);
  }

  @Post('phone/send-otp')
  @ApiOperation({ summary: 'Send OTP to phone number for verification' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  async sendPhoneOtp(
    @GnosisPayToken() token: string,
    @Body() dto: VerifyPhoneDto,
  ): Promise<void> {
    await this.httpService.sendPhoneVerification(token, dto.phone);
  }

  @Post('phone/verify-otp')
  @ApiOperation({ summary: 'Verify OTP sent to phone' })
  @ApiResponse({ status: 200, description: 'Phone verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyPhoneOtp(
    @GnosisPayToken() token: string,
    @Body() dto: VerifyPhoneOtpDto,
  ): Promise<void> {
    await this.httpService.verifyPhoneOtp(token, dto.otp);
  }
}
