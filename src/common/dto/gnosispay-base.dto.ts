import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsBoolean, IsNumber, Min, Max, IsEnum } from 'class-validator';

/**
 * Shared DTOs for GnosisPay API integration
 */

// ==================== COMMON DTOs ====================

export class IdParamDto {
  @ApiProperty({ description: 'Resource ID' })
  @IsString()
  id: string;
}

export class CardIdParamDto {
  @ApiProperty({ description: 'Card ID' })
  @IsString()
  cardId: string;
}

export class WebhookIdParamDto {
  @ApiProperty({ description: 'Webhook ID' })
  @IsString()
  webhookId: string;
}

// ==================== USER MANAGEMENT ====================

export class UpdateUserDto {
  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Address line 1', required: false })
  @IsOptional()
  @IsString()
  address1?: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'State/Province', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Country code (ISO 3166-1 alpha-2)', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

// ==================== CARD MANAGEMENT ====================

export class CreateVirtualCardDto {
  @ApiProperty({ description: 'Card nickname', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}

export class UpdateCardDto {
  @ApiProperty({ description: 'Card nickname', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}

// ==================== PHYSICAL CARD ORDERS ====================

export class CreatePhysicalCardOrderDto {
  @ApiProperty({ description: 'Personalization source', enum: ['KYC', 'ENS'] })
  @IsEnum(['KYC', 'ENS'])
  personalizationSource: 'KYC' | 'ENS';

  @ApiProperty({ description: 'Name to be embossed on card', required: false })
  @IsOptional()
  @IsString()
  embossedName?: string;

  @ApiProperty({ description: 'Shipping address line 1' })
  @IsString()
  address1: string;

  @ApiProperty({ description: 'Shipping address line 2', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Country code (ISO 3166-1 alpha-2)' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Postal code' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'State/Province', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Coupon code', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class ConfirmCardOrderDto {
  @ApiProperty({ description: 'Confirmation code or signature' })
  @IsString()
  confirmation: string;
}

// ==================== SAFE MANAGEMENT ====================

export class SetSafeCurrencyDto {
  @ApiProperty({ description: 'Currency symbol', example: 'EURe' })
  @IsString()
  currency: string;
}

export class CreateSafeTransactionDto {
  @ApiProperty({ description: 'Destination address' })
  @IsString()
  to: string;

  @ApiProperty({ description: 'Transaction value (in wei)' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'Transaction data (hex)', required: false })
  @IsOptional()
  @IsString()
  data?: string;
}

// ==================== WEBHOOKS ====================

export class CreateWebhookDto {
  @ApiProperty({ description: 'Webhook URL' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Array of event types to subscribe to', type: [String] })
  @IsString({ each: true })
  events: string[];

  @ApiProperty({ description: 'Webhook description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateWebhookDto {
  @ApiProperty({ description: 'Webhook URL', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: 'Array of event types', required: false, type: [String] })
  @IsOptional()
  @IsString({ each: true })
  events?: string[];

  @ApiProperty({ description: 'Webhook description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ==================== REWARDS ====================

export class AcceptRewardsTermsDto {
  @ApiProperty({ description: 'Terms version' })
  @IsString()
  version: string;

  @ApiProperty({ description: 'Acceptance confirmation' })
  @IsBoolean()
  accepted: boolean;
}

// ==================== TRANSACTIONS ====================

export class GetTransactionsQueryDto {
  @ApiProperty({ description: 'Card ID filter', required: false })
  @IsOptional()
  @IsString()
  cardId?: string;

  @ApiProperty({ description: 'Start date (ISO 8601)', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: 'End date (ISO 8601)', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ description: 'Transaction type filter', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Page number', required: false, minimum: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
