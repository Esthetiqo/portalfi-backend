import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { CreateWebhookDto, UpdateWebhookDto } from '../../common/dto/gnosispay-base.dto';

@ApiTags('GnosisPay - Webhooks')
@Controller('api/v1/webhooks')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayWebhooksController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiResponse({ status: 200, description: 'Webhooks retrieved successfully' })
  async getWebhooks(@GnosisPayToken() token: string): Promise<any[]> {
    return await this.httpService.getWebhooks(token);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new webhook' })
  @ApiResponse({ status: 201, description: 'Webhook created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async createWebhook(
    @GnosisPayToken() token: string,
    @Body() dto: CreateWebhookDto,
  ): Promise<any> {
    return await this.httpService.createWebhook(token, dto);
  }

  @Get(':webhookId')
  @ApiParam({ name: 'webhookId', description: 'Webhook ID' })
  @ApiOperation({ summary: 'Get webhook details by ID' })
  @ApiResponse({ status: 200, description: 'Webhook retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async getWebhook(
    @GnosisPayToken() token: string,
    @Param('webhookId') webhookId: string,
  ): Promise<any> {
    return await this.httpService.getWebhook(token, webhookId);
  }

  @Patch(':webhookId')
  @ApiParam({ name: 'webhookId', description: 'Webhook ID' })
  @ApiOperation({ summary: 'Update webhook configuration' })
  @ApiResponse({ status: 200, description: 'Webhook updated successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async updateWebhook(
    @GnosisPayToken() token: string,
    @Param('webhookId') webhookId: string,
    @Body() dto: UpdateWebhookDto,
  ): Promise<any> {
    return await this.httpService.updateWebhook(token, webhookId, dto);
  }

  @Delete(':webhookId')
  @ApiParam({ name: 'webhookId', description: 'Webhook ID' })
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, description: 'Webhook deleted successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async deleteWebhook(
    @GnosisPayToken() token: string,
    @Param('webhookId') webhookId: string,
  ): Promise<void> {
    await this.httpService.deleteWebhook(token, webhookId);
  }

  // ===== LOW PRIORITY - WEBHOOKS PARTNER ENDPOINTS =====
  @Get('message/:partnerId')
  @ApiParam({ name: 'partnerId', description: 'Partner ID for webhook subscription' })
  @ApiOperation({ summary: 'Get message to sign for webhook subscription (partner integration)' })
  @ApiResponse({
    status: 200,
    description: 'Signing message retrieved successfully',
    schema: {
      properties: {
        message: { type: 'string', description: 'Message to sign with wallet' },
        partnerId: { type: 'string', description: 'Partner ID' },
        nonce: { type: 'string', description: 'Unique nonce' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async getWebhookMessage(
    @GnosisPayToken() token: string,
    @Param('partnerId') partnerId: string,
  ): Promise<any> {
    return await this.httpService.getWebhookMessage(token, partnerId);
  }

  @Post('subscribe/:partnerId')
  @ApiParam({ name: 'partnerId', description: 'Partner ID to subscribe webhooks for' })
  @ApiOperation({ summary: 'Subscribe to webhooks for partner integration' })
  @ApiResponse({
    status: 201,
    description: 'Webhook subscription created successfully',
    schema: {
      properties: {
        subscriptionId: { type: 'string', description: 'Subscription ID' },
        partnerId: { type: 'string' },
        url: { type: 'string', description: 'Webhook endpoint URL' },
        events: { type: 'array', items: { type: 'string' }, description: 'Subscribed events' },
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid signature or webhook URL' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async subscribeWebhook(
    @GnosisPayToken() token: string,
    @Param('partnerId') partnerId: string,
    @Body() body: { url: string; signature: string; events: string[] },
  ): Promise<any> {
    return await this.httpService.subscribeWebhook(
      token,
      partnerId,
      body.url,
      body.signature,
      body.events,
    );
  }
}
