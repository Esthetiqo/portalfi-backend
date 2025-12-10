import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

export class CreateSafeDto {
  @ApiProperty({
    description: 'Chain ID (currently only supports Gnosis Chain)',
    example: '100',
    enum: ['100'],
  })
  @IsString()
  @IsEnum(['100'])
  chainId: '100';
}

export class DeploySafeModulesDto {
  @ApiProperty({
    description: 'EIP-712 signature for the account setup transaction',
    example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b',
  })
  @IsString()
  signature: string;
}

export class SetCurrencyDto {
  @ApiProperty({
    description: 'Currency symbol to set for the Safe account',
    example: 'EURe',
  })
  @IsString()
  currency: string;
}
