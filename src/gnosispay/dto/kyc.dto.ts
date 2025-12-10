import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class KycAnswerItemDto {
  @ApiProperty({
    description: 'The text of the question being answered',
    example: 'What is your source of funds?',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: "User's answer to the question",
    example: 'Employment income',
  })
  @IsString()
  answer: string;
}

export class SubmitKycAnswersDto {
  @ApiProperty({
    description: 'Array of KYC question answers',
    type: [KycAnswerItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycAnswerItemDto)
  answers: KycAnswerItemDto[];
}

export class VerifyPhoneDto {
  @ApiProperty({
    description: 'Phone number to verify',
    example: '+1234567890',
  })
  @IsString()
  phone: string;
}

export class VerifyPhoneOtpDto {
  @ApiProperty({
    description: 'One-time password sent to the phone',
    example: '123456',
  })
  @IsString()
  otp: string;
}
