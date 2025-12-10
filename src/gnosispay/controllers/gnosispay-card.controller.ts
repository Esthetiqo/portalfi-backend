import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GnosisPayCardService } from '../services/gnosispay-card.service';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { Card, Event } from '../types';

@ApiTags('GnosisPay - Cards')
@Controller('api/v1/cards')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayCardController {
  constructor(
    private readonly gnosisPayCardService: GnosisPayCardService,
    private readonly httpService: GnosisPayHttpService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all cards for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  async getCards(@GnosisPayToken() token: string): Promise<Card[]> {
    return await this.gnosisPayCardService.getCards(token);
  }

  @Post('virtual')
  @ApiOperation({ summary: 'Create a new virtual card' })
  @ApiResponse({
    status: 201,
    description: 'Virtual card created successfully',
  })
  async createVirtualCard(@GnosisPayToken() token: string): Promise<Card> {
    return await this.gnosisPayCardService.createVirtualCard(token);
  }

  @Get(':cardId')
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  @ApiOperation({ summary: 'Get card details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Card details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async getCardById(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<Card> {
    return await this.gnosisPayCardService.getCardById(token, cardId);
  }

  @Post(':cardId/activate')
  @ApiParam({ name: 'cardId', description: 'Card ID to activate' })
  @ApiOperation({ summary: 'Activate a card' })
  @ApiResponse({ status: 200, description: 'Card activated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Card already activated or blocked',
  })
  async activateCard(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.gnosisPayCardService.activateCard(token, cardId);
  }

  @Post(':cardId/freeze')
  @ApiParam({ name: 'cardId', description: 'Card ID to freeze' })
  @ApiOperation({ summary: 'Freeze a card (temporary block)' })
  @ApiResponse({ status: 200, description: 'Card frozen successfully' })
  async freezeCard(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.gnosisPayCardService.freezeCard(token, cardId);
  }

  @Post(':cardId/unfreeze')
  @ApiParam({ name: 'cardId', description: 'Card ID to unfreeze' })
  @ApiOperation({ summary: 'Unfreeze a card' })
  @ApiResponse({ status: 200, description: 'Card unfrozen successfully' })
  async unfreezeCard(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.gnosisPayCardService.unfreezeCard(token, cardId);
  }

  @Post(':cardId/report-lost')
  @ApiParam({ name: 'cardId', description: 'Card ID to report as lost' })
  @ApiOperation({ summary: 'Report card as lost (permanent block)' })
  @ApiResponse({
    status: 200,
    description: 'Card reported as lost successfully',
  })
  async reportCardLost(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.gnosisPayCardService.reportCardLost(token, cardId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transactions for all cards (global view)' })
  @ApiQuery({
    name: 'cardTokens',
    required: false,
    description: 'Filter by specific card tokens (comma-separated)',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of transactions to return',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset',
    type: Number,
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description: 'Get transactions before this date (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'after',
    required: false,
    description: 'Get transactions after this date (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'billingCurrency',
    required: false,
    description: 'Filter by billing currency',
    type: String,
  })
  @ApiQuery({
    name: 'transactionCurrency',
    required: false,
    description: 'Filter by transaction currency',
    type: String,
  })
  @ApiQuery({
    name: 'mcc',
    required: false,
    description: 'Filter by merchant category code',
    type: String,
  })
  @ApiQuery({
    name: 'transactionType',
    required: false,
    description: 'Filter by transaction type',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          cardToken: { type: 'string' },
          amount: { type: 'string' },
          currency: { type: 'string' },
          merchant: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          status: { type: 'string' },
        },
      },
    },
  })
  async getAllCardsTransactions(
    @GnosisPayToken() token: string,
    @Query('cardTokens') cardTokens?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('before') before?: string,
    @Query('after') after?: string,
    @Query('billingCurrency') billingCurrency?: string,
    @Query('transactionCurrency') transactionCurrency?: string,
    @Query('mcc') mcc?: string,
    @Query('transactionType') transactionType?: string,
  ): Promise<any> {
    const params: any = {};
    if (cardTokens) params.cardTokens = cardTokens.split(',');
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (before) params.before = before;
    if (after) params.after = after;
    if (billingCurrency) params.billingCurrency = billingCurrency;
    if (transactionCurrency) params.transactionCurrency = transactionCurrency;
    if (mcc) params.mcc = mcc;
    if (transactionType) params.transactionType = transactionType;

    return await this.httpService.getCardTransactions(token, params);
  }

  @Get(':cardId/transactions')
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  @ApiOperation({ summary: 'Get all transactions for a specific card' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  async getCardTransactions(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<Event[]> {
    return await this.gnosisPayCardService.getCardTransactions(token, cardId);
  }

  // ===== HIGH PRIORITY CARD ENDPOINTS =====
  @Get(':cardId/status')
  @ApiParam({ name: 'cardId', description: 'Card ID' })
  @ApiOperation({ summary: 'Get card status information' })
  @ApiResponse({
    status: 200,
    description: 'Card status retrieved successfully',
    schema: {
      properties: {
        status: {
          type: 'string',
          enum: ['inactive', 'active', 'frozen', 'lost', 'stolen', 'void'],
        },
        canActivate: { type: 'boolean' },
        canFreeze: { type: 'boolean' },
        canUnfreeze: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async getCardStatus(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<any> {
    return await this.gnosisPayCardService.getCardStatus(token, cardId);
  }

  @Post(':cardId/stolen')
  @ApiParam({ name: 'cardId', description: 'Card ID to report as stolen' })
  @ApiOperation({
    summary: 'Report card as stolen (permanent block, replacement issued)',
  })
  @ApiResponse({
    status: 200,
    description: 'Card reported as stolen successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Card already blocked or invalid state',
  })
  async reportCardStolen(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.gnosisPayCardService.reportCardStolen(token, cardId);
  }

  @Post(':cardId/void')
  @ApiParam({ name: 'cardId', description: 'Card ID to void' })
  @ApiOperation({
    summary: 'Void a virtual card (permanent, cannot be undone)',
  })
  @ApiResponse({ status: 200, description: 'Card voided successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot void physical cards or card already blocked',
  })
  async voidCard(
    @GnosisPayToken() token: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.gnosisPayCardService.voidCard(token, cardId);
  }
}
