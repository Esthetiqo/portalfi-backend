import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { AcceptRewardsTermsDto } from '../../common/dto/gnosispay-base.dto';

@ApiTags('GnosisPay - Rewards & Cashback')
@Controller('api/v1/rewards')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayRewardsController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Get rewards and cashback information' })
  @ApiResponse({ status: 200, description: 'Rewards information retrieved successfully' })
  async getRewards(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getRewards(token);
  }

  @Post('accept-terms')
  @ApiOperation({ summary: 'Accept rewards program terms and conditions' })
  @ApiResponse({ status: 200, description: 'Terms accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid terms data' })
  async acceptTerms(
    @GnosisPayToken() token: string,
    @Body() dto: AcceptRewardsTermsDto,
  ): Promise<void> {
    if (!dto.accepted) {
      throw new Error('Terms must be accepted');
    }
    await this.httpService.acceptRewardsTerms(token, dto.version);
  }
}

// ===== CASHBACK CONTROLLER (HIGH PRIORITY) =====
@ApiTags('GnosisPay - Cashback')
@Controller('api/v1/cashback')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayCashbackController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve cashback information' })
  @ApiResponse({
    status: 200,
    description: 'Cashback information retrieved successfully',
    schema: {
      properties: {
        totalEarned: { type: 'string', description: 'Total cashback earned' },
        available: { type: 'string', description: 'Available cashback balance' },
        pending: { type: 'string', description: 'Pending cashback' },
        currency: { type: 'string', description: 'Currency code' },
      },
    },
  })
  async getCashback(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getCashback(token);
  }
}

// ===== USER TERMS CONTROLLER (HIGH PRIORITY) =====
@ApiTags('GnosisPay - User Terms')
@Controller('api/v1/user/terms')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayUserTermsController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve user terms and conditions status' })
  @ApiResponse({
    status: 200,
    description: 'Terms status retrieved successfully',
    schema: {
      properties: {
        accepted: { type: 'boolean', description: 'Whether terms have been accepted' },
        version: { type: 'string', description: 'Current terms version' },
        acceptedAt: { type: 'string', format: 'date-time', description: 'When terms were accepted' },
        latestVersion: { type: 'string', description: 'Latest available terms version' },
      },
    },
  })
  async getUserTermsStatus(@GnosisPayToken() token: string): Promise<any> {
    return await this.httpService.getUserTermsStatus(token);
  }

  @Post()
  @ApiOperation({ summary: 'Accept user terms and conditions' })
  @ApiResponse({ status: 201, description: 'Terms accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid terms type or version' })
  async acceptUserTerms(
    @GnosisPayToken() token: string,
    @Body() body: { type: string; version: string },
  ): Promise<void> {
    await this.httpService.acceptUserTerms(token, body.type, body.version);
  }
}
