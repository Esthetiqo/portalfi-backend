import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class CreateVirtualCardDto {
  @ApiProperty({
    description: 'Whether this is a virtual card',
    example: true,
    default: true,
  })
  @IsBoolean()
  virtual: boolean;
}

export class ActivateCardDto {
  @ApiProperty({
    description: 'Card ID to activate',
    example: 'card_123456',
  })
  @IsString()
  cardId: string;
}

export class FreezeCardDto {
  @ApiProperty({
    description: 'Card ID to freeze',
    example: 'card_123456',
  })
  @IsString()
  cardId: string;
}

export class UnfreezeCardDto {
  @ApiProperty({
    description: 'Card ID to unfreeze',
    example: 'card_123456',
  })
  @IsString()
  cardId: string;
}

export class ReportCardLostDto {
  @ApiProperty({
    description: 'Card ID to report as lost',
    example: 'card_123456',
  })
  @IsString()
  cardId: string;
}

export class OrderPhysicalCardDto {
  @ApiProperty({
    description: 'Personalization source',
    enum: ['KYC', 'ENS'],
    example: 'KYC',
  })
  @IsEnum(['KYC', 'ENS'])
  personalizationSource: 'KYC' | 'ENS';

  @ApiProperty({
    description: 'Name to emboss on the card',
    example: 'JOHN DOE',
  })
  @IsString()
  embossedName: string;

  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main St',
  })
  @IsString()
  address1: string;

  @ApiProperty({
    description: 'Address line 2',
    example: 'Apt 4B',
    required: false,
  })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Country code',
    example: 'US',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10001',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'State or province',
    example: 'NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Coupon code for discount',
    example: 'DISCOUNT2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
