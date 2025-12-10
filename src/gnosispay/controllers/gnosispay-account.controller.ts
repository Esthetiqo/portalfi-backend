import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { AccountBalanceResponse, SafeConfig, DelayTransaction } from '../types';

@ApiTags('GnosisPay - Account Management')
@Controller('api/v1/account')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayAccountController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get('balances')
  @ApiOperation({ summary: 'Get account balance information' })
  @ApiResponse({
    status: 200,
    description: 'Balance information retrieved successfully',
    schema: {
      properties: {
        total: { type: 'string', description: 'Total balance (spendable + pending)' },
        spendable: { type: 'string', description: 'Amount that can be spent' },
        pending: { type: 'string', description: 'Amount being reviewed' },
      },
    },
  })
  async getAccountBalance(@GnosisPayToken() token: string): Promise<AccountBalanceResponse> {
    return await this.httpService.getAccountBalance(token);
  }

  @Get('safe-config')
  @ApiOperation({ summary: 'Get Safe configuration details' })
  @ApiResponse({ status: 200, description: 'Safe config retrieved successfully' })
  async getSafeConfig(@GnosisPayToken() token: string): Promise<SafeConfig> {
    return await this.httpService.getSafeConfig(token);
  }

  @Get('delay-transactions')
  @ApiOperation({ summary: 'Get all delay transactions' })
  @ApiResponse({ status: 200, description: 'Delay transactions retrieved successfully' })
  async getDelayTransactions(@GnosisPayToken() token: string): Promise<DelayTransaction[]> {
    return await this.httpService.getDelayTransactions(token);
  }
}

// ===== NEW CONTROLLER FOR /api/v1/accounts (plural) routes =====
@ApiTags('GnosisPay - Accounts Operations')
@Controller('api/v1/accounts')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayAccountsController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  // ===== DAILY LIMIT ENDPOINTS (HIGH PRIORITY) =====
  @Get('daily-limit')
  @ApiOperation({ summary: 'Get current daily spending limit' })
  @ApiResponse({
    status: 200,
    description: 'Daily limit retrieved successfully',
    schema: {
      properties: {
        limit: { type: 'string', description: 'Current daily limit in wei' },
        spent: { type: 'string', description: 'Amount spent today in wei' },
        remaining: { type: 'string', description: 'Remaining limit for today in wei' },
      },
    },
  })
  async getDailyLimit(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getDailyLimit(token);
  }

  @Put('daily-limit')
  @ApiOperation({ summary: 'Set new daily spending limit' })
  @ApiResponse({ status: 200, description: 'Daily limit updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid limit or signature' })
  async setDailyLimit(
    @GnosisPayToken() token: string,
    @Body() body: { newLimit: string; signature: string },
  ): Promise<any> {
    return await this.httpService.setDailyLimit(token, body.newLimit, body.signature);
  }

  @Get('daily-limit/transaction-data')
  @ApiOperation({ summary: 'Get EIP-712 typed data for daily limit signature' })
  @ApiQuery({ name: 'newLimit', description: 'New daily limit in wei', required: true })
  @ApiResponse({ status: 200, description: 'Transaction data retrieved successfully' })
  async getDailyLimitTransactionData(
    @GnosisPayToken() token: string,
    @Query('newLimit') newLimit: string,
  ): Promise<any> {
    return await this.httpService.getDailyLimitTransactionData(token, newLimit);
  }

  // ===== WITHDRAW ENDPOINTS (HIGH PRIORITY) =====
  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw funds from Safe' })
  @ApiResponse({ status: 200, description: 'Withdrawal initiated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid withdrawal data or signature' })
  async withdrawFromSafe(
    @GnosisPayToken() token: string,
    @Body() body: { tokenAddress: string; to: string; amount: string; signature: string },
  ): Promise<any> {
    return await this.httpService.withdrawFromSafe(
      token,
      body.tokenAddress,
      body.to,
      body.amount,
      body.signature,
    );
  }

  @Get('withdraw/transaction-data')
  @ApiOperation({ summary: 'Get EIP-712 typed data for withdraw signature' })
  @ApiQuery({ name: 'tokenAddress', description: 'Token contract address', required: true })
  @ApiQuery({ name: 'to', description: 'Recipient address', required: true })
  @ApiQuery({ name: 'amount', description: 'Amount to withdraw in wei', required: true })
  @ApiResponse({ status: 200, description: 'Transaction data retrieved successfully' })
  async getWithdrawTransactionData(
    @GnosisPayToken() token: string,
    @Query('tokenAddress') tokenAddress: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ): Promise<any> {
    return await this.httpService.getWithdrawTransactionData(token, tokenAddress, to, amount);
  }

  // ===== LOW PRIORITY - DEPRECATED ENDPOINTS (Backward Compatibility) =====
  @Get('onchain-daily-limit')
  @ApiOperation({
    summary: '⚠️ DEPRECATED: Get daily limit (use /daily-limit instead)',
    deprecated: true,
  })
  @ApiResponse({ status: 200, description: 'Daily limit retrieved (deprecated endpoint)' })
  async getOnchainDailyLimit(@GnosisPayToken() token: string): Promise<any> {
    // Maps to the new daily-limit endpoint
    return await this.httpService.getDailyLimit(token);
  }

  @Put('onchain-daily-limit')
  @ApiOperation({
    summary: '⚠️ DEPRECATED: Set daily limit (use /daily-limit instead)',
    deprecated: true,
  })
  @ApiResponse({ status: 200, description: 'Daily limit updated (deprecated endpoint)' })
  async setOnchainDailyLimit(
    @GnosisPayToken() token: string,
    @Body() body: { newLimit: string; signature: string },
  ): Promise<any> {
    // Maps to the new daily-limit endpoint
    return await this.httpService.setDailyLimit(token, body.newLimit, body.signature);
  }

  @Get('onchain-daily-limit/transaction-data')
  @ApiOperation({
    summary: '⚠️ DEPRECATED: Get transaction data for daily limit (use /daily-limit/transaction-data instead)',
    deprecated: true,
  })
  @ApiQuery({ name: 'newLimit', description: 'New daily limit in wei', required: true })
  @ApiResponse({ status: 200, description: 'Transaction data retrieved (deprecated endpoint)' })
  async getOnchainDailyLimitTransactionData(
    @GnosisPayToken() token: string,
    @Query('newLimit') newLimit: string,
  ): Promise<any> {
    // Maps to the new daily-limit/transaction-data endpoint
    return await this.httpService.getDailyLimitTransactionData(token, newLimit);
  }
}

// ===== NEW CONTROLLER FOR EOA ACCOUNTS =====
@ApiTags('GnosisPay - EOA Accounts')
@Controller('api/v1/eoa-accounts')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayEoaAccountsController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'List all authenticated account addresses' })
  @ApiResponse({
    status: 200,
    description: 'EOA accounts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          address: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getEoaAccounts(@GnosisPayToken() token: string): Promise<any[]> {
    return await this.httpService.getEoaAccounts(token);
  }

  @Post()
  @ApiOperation({ summary: 'Add new authenticated account address' })
  @ApiResponse({ status: 201, description: 'EOA account added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid address or signature' })
  async addEoaAccount(
    @GnosisPayToken() token: string,
    @Body() body: { address: string; message: string; signature: string },
  ): Promise<any> {
    return await this.httpService.addEoaAccount(token, body.address, body.message, body.signature);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'EOA account ID to remove' })
  @ApiOperation({ summary: 'Remove authenticated account address' })
  @ApiResponse({ status: 200, description: 'EOA account removed successfully' })
  @ApiResponse({ status: 404, description: 'EOA account not found' })
  async removeEoaAccount(
    @GnosisPayToken() token: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.httpService.removeEoaAccount(token, id);
  }
}
