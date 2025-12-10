import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import {
  CreatePhysicalCardOrderDto,
  ConfirmCardOrderDto,
} from '../../common/dto/gnosispay-base.dto';
import { CardOrder } from '../types';

@ApiTags('GnosisPay - Physical Card Orders')
@Controller('api/v1/card-orders')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayCardOrdersController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Get all card orders' })
  @ApiResponse({
    status: 200,
    description: 'Card orders retrieved successfully',
  })
  async getCardOrders(@GnosisPayToken() token: string): Promise<CardOrder[]> {
    return await this.httpService.getCardOrders(token);
  }

  @Post('physical')
  @ApiOperation({ summary: 'Order a physical card' })
  @ApiResponse({
    status: 201,
    description: 'Physical card order created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  async createPhysicalCardOrder(
    @GnosisPayToken() token: string,
    @Body() dto: CreatePhysicalCardOrderDto,
  ): Promise<CardOrder> {
    return await this.httpService.createPhysicalCardOrder(token, dto);
  }

  @Get(':orderId')
  @ApiParam({ name: 'orderId', description: 'Card order ID' })
  @ApiOperation({ summary: 'Get card order details' })
  @ApiResponse({
    status: 200,
    description: 'Card order retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Card order not found' })
  async getCardOrder(
    @GnosisPayToken() token: string,
    @Param('orderId') orderId: string,
  ): Promise<CardOrder> {
    return await this.httpService.getCardOrder(token, orderId);
  }

  @Patch(':orderId/cancel')
  @ApiParam({ name: 'orderId', description: 'Card order ID to cancel' })
  @ApiOperation({ summary: 'Cancel a card order' })
  @ApiResponse({
    status: 200,
    description: 'Card order cancelled successfully',
  })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled' })
  async cancelCardOrder(
    @GnosisPayToken() token: string,
    @Param('orderId') orderId: string,
  ): Promise<void> {
    await this.httpService.cancelCardOrder(token, orderId);
  }

  @Post(':orderId/confirm')
  @ApiParam({ name: 'orderId', description: 'Card order ID to confirm' })
  @ApiOperation({ summary: 'Confirm a card order' })
  @ApiResponse({
    status: 200,
    description: 'Card order confirmed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid confirmation data' })
  async confirmCardOrder(
    @GnosisPayToken() token: string,
    @Param('orderId') orderId: string,
    @Body() dto: ConfirmCardOrderDto,
  ): Promise<void> {
    await this.httpService.confirmCardOrderPayment(token, orderId);
  }

  // ===== HIGH PRIORITY CREATE PHYSICAL CARD ENDPOINT =====
  @Post(':orderId/create-card')
  @ApiParam({
    name: 'orderId',
    description: 'Order ID for which to create physical card',
  })
  @ApiOperation({ summary: 'Create a physical card from confirmed order' })
  @ApiResponse({
    status: 201,
    description: 'Physical card created successfully',
    schema: {
      properties: {
        cardId: { type: 'string', description: 'Created card ID' },
        status: { type: 'string', description: 'Card status' },
        orderId: { type: 'string', description: 'Associated order ID' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Order not confirmed or payment not completed',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async createPhysicalCard(
    @GnosisPayToken() token: string,
    @Param('orderId') orderId: string,
  ): Promise<any> {
    return await this.httpService.createPhysicalCard(token, orderId);
  }

  // ===== MEDIUM PRIORITY - PHYSICAL CARD ORDER MANAGEMENT =====
  @Post(':orderId/attach-coupon')
  @ApiParam({ name: 'orderId', description: 'Order ID to attach coupon to' })
  @ApiOperation({ summary: 'Attach discount coupon to physical card order' })
  @ApiResponse({
    status: 200,
    description: 'Coupon attached successfully',
    schema: {
      properties: {
        orderId: { type: 'string' },
        couponCode: { type: 'string' },
        discountApplied: { type: 'string', description: 'Discount amount' },
        newTotal: {
          type: 'string',
          description: 'New order total after discount',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid coupon code or order not eligible',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async attachCouponToOrder(
    @GnosisPayToken() token: string,
    @Param('orderId') orderId: string,
    @Body() body: { couponCode: string },
  ): Promise<any> {
    return await this.httpService.attachCouponToOrder(
      token,
      orderId,
      body.couponCode,
    );
  }

  @Post(':orderId/attach-transaction')
  @ApiParam({
    name: 'orderId',
    description: 'Order ID to register payment for',
  })
  @ApiOperation({
    summary: 'Register payment transaction hash for physical card order',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction registered successfully',
    schema: {
      properties: {
        orderId: { type: 'string' },
        transactionHash: { type: 'string' },
        paymentStatus: {
          type: 'string',
          enum: ['pending', 'confirmed', 'failed'],
        },
        confirmedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid transaction hash or order already paid',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async attachTransactionToOrder(
    @GnosisPayToken() token: string,
    @Param('orderId') orderId: string,
    @Body() body: { transactionHash: string },
  ): Promise<any> {
    return await this.httpService.attachTransactionToOrder(
      token,
      orderId,
      body.transactionHash,
    );
  }
}
