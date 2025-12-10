import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class GenerateNonceDto {
  // No body needed for GET request
}

export class VerifyChallengeDto {
  @ApiProperty({
    description: 'SIWE message containing the nonce',
    example: 'example.com wants you to sign in with your Ethereum account...',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'EOA signature or EIP-1271 contract signature',
    example: '0x1234567890abcdef...',
  })
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Duration of the token in seconds (min: 60, max: 86400)',
    example: 3600,
    required: false,
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  ttlInSeconds?: number;
}

export class SignupDto {
  @ApiProperty({
    description: 'Email address for the new user',
    example: 'user@example.com',
  })
  @IsEmail()
  authEmail: string;

  @ApiProperty({
    description: 'One-time password for email verification',
    example: '123456',
    required: false,
    minLength: 6,
    maxLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp?: string;

  @ApiProperty({
    description: 'Referral coupon code',
    example: 'FRIEND2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  referralCouponCode?: string;

  @ApiProperty({
    description: 'Marketing campaign identifier',
    example: 'spring-2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  marketingCampaign?: string;

  @ApiProperty({
    description: 'Partner ID that referred the user',
    example: 'partner-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  partnerId?: string;
}
