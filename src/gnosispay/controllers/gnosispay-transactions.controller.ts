import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { GetTransactionsQueryDto } from '../../common/dto/gnosispay-base.dto';
import { Event } from '../types';

@ApiTags('GnosisPay - Transactions')
@Controller('api/v1/transactions')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayTransactionsController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  @ApiQuery({
    name: 'cardId',
    required: false,
    description: 'Filter by card ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO 8601)',
  })
  @ApiQuery({ name: 'type', required: false, description: 'Transaction type' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  async getTransactions(
    @GnosisPayToken() token: string,
    @Query() query: GetTransactionsQueryDto,
  ): Promise<Event[]> {
    return await this.httpService.getTransactions(token, query);
  }

  @Get(':transactionId')
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiOperation({ summary: 'Get transaction details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransaction(
    @GnosisPayToken() token: string,
    @Param('transactionId') transactionId: string,
  ): Promise<Event> {
    return await this.httpService.getTransaction(token, transactionId);
  }

  // ===== HIGH PRIORITY DISPUTE ENDPOINTS =====
  @Get('dispute/reasons')
  @ApiOperation({ summary: 'List available dispute reasons' })
  @ApiResponse({
    status: 200,
    description: 'Dispute reasons retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          code: { type: 'string', description: 'Reason code' },
          label: { type: 'string', description: 'Human-readable label' },
          description: { type: 'string', description: 'Detailed description' },
        },
      },
    },
  })
  async getDisputeReasons(@GnosisPayToken() token: string): Promise<any[]> {
    return await this.httpService.getDisputeReasons(token);
  }

  @Post(':threadId/dispute')
  @ApiParam({
    name: 'threadId',
    description: 'Transaction thread ID to dispute',
  })
  @ApiOperation({ summary: 'Dispute a transaction' })
  @ApiResponse({ status: 201, description: 'Dispute filed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Transaction cannot be disputed or invalid reason',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async disputeTransaction(
    @GnosisPayToken() token: string,
    @Param('threadId') threadId: string,
    @Body() body: { reason: string; description?: string },
  ): Promise<any> {
    return await this.httpService.disputeTransaction(
      token,
      threadId,
      body.reason,
      body.description,
    );
  }
}
