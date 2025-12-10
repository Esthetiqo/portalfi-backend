import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import {
  SetSafeCurrencyDto,
  CreateSafeTransactionDto,
} from '../../common/dto/gnosispay-base.dto';

@ApiTags('GnosisPay - Safe Management')
@Controller('api/v1/safe')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPaySafeController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Post('set-currency')
  @ApiOperation({ summary: 'Set currency for Safe account' })
  @ApiResponse({ status: 200, description: 'Currency set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid currency' })
  async setSafeCurrency(
    @GnosisPayToken() token: string,
    @Body() dto: SetSafeCurrencyDto,
  ): Promise<void> {
    await this.httpService.setSafeCurrency(token, dto.currency);
  }

  @Get('supported-currencies')
  @ApiOperation({ summary: 'Get list of supported currencies' })
  @ApiResponse({
    status: 200,
    description: 'Supported currencies retrieved successfully',
  })
  async getSupportedCurrencies(
    @GnosisPayToken() token: string,
  ): Promise<any[]> {
    return await this.httpService.getSupportedCurrencies(token);
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Create a Safe transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid transaction data' })
  async createSafeTransaction(
    @GnosisPayToken() token: string,
    @Body() dto: CreateSafeTransactionDto,
  ): Promise<any> {
    return await this.httpService.createSafeTransaction(token, dto);
  }

  // ===== SAFE DEPLOYMENT ENDPOINTS (HIGH PRIORITY) =====
  @Post('deploy')
  @ApiOperation({ summary: 'Deploy and setup a Safe' })
  @ApiResponse({
    status: 200,
    description: 'Safe deployment initiated successfully',
    schema: {
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'deploying', 'deployed', 'failed'],
        },
        safeAddress: {
          type: 'string',
          description: 'Safe contract address (if deployed)',
        },
        transactionHash: {
          type: 'string',
          description: 'Deployment transaction hash',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Safe already exists or deployment failed',
  })
  async deploySafe(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.deploySafe(token);
  }

  @Get('deploy')
  @ApiOperation({ summary: 'Get Safe deployment status' })
  @ApiResponse({
    status: 200,
    description: 'Deployment status retrieved successfully',
    schema: {
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'deploying', 'deployed', 'failed'],
        },
        safeAddress: { type: 'string' },
        transactionHash: { type: 'string' },
        error: { type: 'string', description: 'Error message if failed' },
      },
    },
  })
  async getSafeDeploymentStatus(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getSafeDeploymentStatus(token);
  }

  @Delete('reset')
  @ApiOperation({ summary: 'Reset Safe account' })
  @ApiResponse({ status: 200, description: 'Safe reset successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot reset Safe with balance or active cards',
  })
  async resetSafe(@GnosisPayToken() token: string): Promise<void> {
    await this.httpService.resetSafe(token);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get Safe configuration details' })
  @ApiResponse({
    status: 200,
    description: 'Safe configuration retrieved successfully',
    schema: {
      properties: {
        address: { type: 'string', description: 'Safe contract address' },
        owners: { type: 'array', items: { type: 'string' } },
        threshold: { type: 'number', description: 'Required signatures' },
        modules: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async getSafeConfigDetails(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getSafeConfig(token);
  }
}

// ===== NEW CONTROLLER FOR SAFE OWNERS =====
@ApiTags('GnosisPay - Safe Owners')
@Controller('api/v1/owners')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPaySafeOwnersController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'List all Safe owners' })
  @ApiResponse({
    status: 200,
    description: 'Safe owners retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        description: 'Owner address',
      },
    },
  })
  async getSafeOwners(@GnosisPayToken() token: string): Promise<any[]> {
    return await this.httpService.getSafeOwners(token);
  }

  @Post()
  @ApiOperation({ summary: 'Add new Safe owner' })
  @ApiResponse({ status: 200, description: 'Owner added successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid owner address or signature',
  })
  async addSafeOwner(
    @GnosisPayToken() token: string,
    @Body() body: { newOwner: string; signature: string },
  ): Promise<any> {
    return await this.httpService.addSafeOwner(
      token,
      body.newOwner,
      body.signature,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Remove Safe owner' })
  @ApiResponse({ status: 200, description: 'Owner removed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot remove last owner or invalid signature',
  })
  async removeSafeOwner(
    @GnosisPayToken() token: string,
    @Body() body: { ownerToRemove: string; signature: string },
  ): Promise<any> {
    return await this.httpService.removeSafeOwner(
      token,
      body.ownerToRemove,
      body.signature,
    );
  }

  @Get('add/transaction-data')
  @ApiOperation({ summary: 'Get EIP-712 typed data for adding owner' })
  @ApiQuery({
    name: 'newOwner',
    description: 'Address of new owner to add',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction data retrieved successfully',
  })
  async getAddOwnerTransactionData(
    @GnosisPayToken() token: string,
    @Query('newOwner') newOwner: string,
  ): Promise<any> {
    return await this.httpService.getAddOwnerTransactionData(token, newOwner);
  }

  @Get('remove/transaction-data')
  @ApiOperation({ summary: 'Get EIP-712 typed data for removing owner' })
  @ApiQuery({
    name: 'ownerToRemove',
    description: 'Address of owner to remove',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction data retrieved successfully',
  })
  async getRemoveOwnerTransactionData(
    @GnosisPayToken() token: string,
    @Query('ownerToRemove') ownerToRemove: string,
  ): Promise<any> {
    return await this.httpService.getRemoveOwnerTransactionData(
      token,
      ownerToRemove,
    );
  }
}

// ===== NEW CONTROLLER FOR DELAY RELAY =====
@ApiTags('GnosisPay - Delay Relay')
@Controller('api/v1/delay-relay')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayDelayRelayController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'List all delayed transactions' })
  @ApiResponse({
    status: 200,
    description: 'Delayed transactions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          txHash: { type: 'string' },
          queuedAt: { type: 'string', format: 'date-time' },
          executableAt: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['queued', 'executed', 'cancelled'] },
        },
      },
    },
  })
  async getDelayTransactions(@GnosisPayToken() token: string): Promise<any[]> {
    return await this.httpService.getDelayTransactions(token);
  }
}

// ===== NEW CONTROLLER FOR /api/v1/account (Account setup) =====
@ApiTags('GnosisPay - Account Setup')
@Controller('api/v1/account')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayAccountSetupController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Post()
  @ApiOperation({ summary: 'Create or deploy a Safe account' })
  @ApiResponse({
    status: 201,
    description: 'Safe account created successfully',
    schema: {
      properties: {
        safeAddress: { type: 'string' },
        owners: { type: 'array', items: { type: 'string' } },
        threshold: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Safe already exists or invalid chain',
  })
  async createSafe(
    @GnosisPayToken() token: string,
    @Body() body: { chainId: number },
  ): Promise<any> {
    return await this.httpService.createSafe(token, body.chainId);
  }

  // ===== MEDIUM PRIORITY - ACCOUNT SETUP ENDPOINTS =====
  @Get('signature-payload')
  @ApiOperation({ summary: 'Retrieve signature data for account setup' })
  @ApiResponse({
    status: 200,
    description: 'Signature payload retrieved successfully',
    schema: {
      properties: {
        message: { type: 'string', description: 'Message to sign' },
        domain: { type: 'object', description: 'EIP-712 domain data' },
        types: { type: 'object', description: 'EIP-712 types' },
        primaryType: { type: 'string', description: 'Primary type name' },
        value: { type: 'object', description: 'Values to sign' },
      },
    },
  })
  async getSignaturePayload(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getSignaturePayload(token);
  }

  @Patch('deploy-safe-modules')
  @ApiOperation({ summary: 'Setup Safe with signature (deploy modules)' })
  @ApiResponse({
    status: 200,
    description: 'Safe modules deployed successfully',
    schema: {
      properties: {
        success: { type: 'boolean' },
        transactionHash: {
          type: 'string',
          description: 'Transaction hash if applicable',
        },
        status: { type: 'string', description: 'Deployment status' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature or Safe not ready',
  })
  async deploySafeModules(
    @GnosisPayToken() token: string,
    @Body() body: { signature: string },
  ): Promise<any> {
    return await this.httpService.deploySafeModules(token, body.signature);
  }
}
