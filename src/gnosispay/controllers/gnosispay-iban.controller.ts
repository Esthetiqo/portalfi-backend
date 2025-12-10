import {
  Controller,
  Get,
  Post,
  Delete,
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

@ApiTags('GnosisPay - IBAN & Monerium')
@Controller('api/v1/ibans')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayIbanController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get('available')
  @ApiOperation({ summary: 'Check IBAN availability for user' })
  @ApiResponse({
    status: 200,
    description: 'IBAN availability checked successfully',
    schema: {
      properties: {
        available: {
          type: 'boolean',
          description: 'Whether IBAN is available for this user',
        },
        reason: { type: 'string', description: 'Reason if not available' },
        region: { type: 'string', description: 'Available region' },
      },
    },
  })
  async getIbanAvailability(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getIbanAvailability(token);
  }

  @Get('details')
  @ApiOperation({ summary: 'Retrieve IBAN account details' })
  @ApiResponse({
    status: 200,
    description: 'IBAN details retrieved successfully',
    schema: {
      properties: {
        iban: { type: 'string', description: 'IBAN number' },
        bic: { type: 'string', description: 'BIC/SWIFT code' },
        accountHolder: { type: 'string', description: 'Account holder name' },
        status: { type: 'string', enum: ['active', 'pending', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'No IBAN account found' })
  async getIbanDetails(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getIbanDetails(token);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Retrieve IBAN orders history' })
  @ApiResponse({
    status: 200,
    description: 'IBAN orders retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          orderId: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          iban: { type: 'string' },
        },
      },
    },
  })
  async getIbanOrders(@GnosisPayToken() token: string): Promise<any[]> {
    return await this.httpService.getIbanOrders(token);
  }

  @Get('signing-message')
  @ApiOperation({ summary: 'Get message to sign for IBAN activation' })
  @ApiResponse({
    status: 200,
    description: 'Signing message retrieved successfully',
    schema: {
      properties: {
        message: { type: 'string', description: 'Message to sign with wallet' },
        nonce: { type: 'string', description: 'Unique nonce for this request' },
      },
    },
  })
  async getIbanSigningMessage(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getIbanSigningMessage(token);
  }

  @Get('oauth/redirect_url')
  @ApiOperation({ summary: 'Get Monerium OAuth redirect URL' })
  @ApiQuery({
    name: 'callbackUrl',
    description: 'Callback URL after OAuth flow',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'OAuth redirect URL retrieved successfully',
    schema: {
      properties: {
        redirectUrl: {
          type: 'string',
          description: 'Monerium OAuth URL to redirect user to',
        },
        state: { type: 'string', description: 'OAuth state parameter' },
      },
    },
  })
  async getIbanOauthRedirectUrl(
    @GnosisPayToken() token: string,
    @Query('callbackUrl') callbackUrl: string,
  ): Promise<any> {
    return await this.httpService.getIbanOauthRedirectUrl(token, callbackUrl);
  }

  @Post('monerium-profile')
  @ApiOperation({ summary: 'Create Monerium profile for IBAN' })
  @ApiResponse({
    status: 201,
    description: 'Monerium profile created successfully',
    schema: {
      properties: {
        profileId: { type: 'string' },
        status: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Profile creation failed or already exists',
  })
  async createMoneriumProfile(
    @GnosisPayToken() token: string,
    @Body() body: { callbackUrl: string },
  ): Promise<any> {
    return await this.httpService.createMoneriumProfile(
      token,
      body.callbackUrl,
    );
  }

  @Delete('reset')
  @ApiOperation({
    summary: 'Reset IBAN integration (remove Monerium connection)',
  })
  @ApiResponse({
    status: 200,
    description: 'IBAN integration reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot reset - pending transactions or active balance',
  })
  async resetIban(@GnosisPayToken() token: string): Promise<void> {
    await this.httpService.resetIban(token);
  }
}

// ===== MONERIUM INTEGRATIONS CONTROLLER =====
@ApiTags('GnosisPay - Monerium Integration')
@Controller('api/v1/integrations')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayMoneriumController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Post('monerium')
  @ApiOperation({ summary: 'Create Monerium integration with signature' })
  @ApiResponse({
    status: 201,
    description: 'Monerium integration created successfully',
    schema: {
      properties: {
        integrationId: { type: 'string', description: 'Integration ID' },
        status: { type: 'string', enum: ['pending', 'active', 'failed'] },
        accounts: {
          type: 'array',
          items: { type: 'object' },
          description: 'Connected accounts',
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature or accounts data',
  })
  async createMoneriumIntegration(
    @GnosisPayToken() token: string,
    @Body() body: { signature: string; accounts: any[] },
  ): Promise<any> {
    return await this.httpService.createMoneriumIntegration(
      token,
      body.signature,
      body.accounts,
    );
  }
}
