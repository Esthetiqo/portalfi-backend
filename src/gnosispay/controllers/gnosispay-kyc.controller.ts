import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GnosisPayKycService } from '../services/gnosispay-kyc.service';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import {
  SubmitKycAnswersDto,
  VerifyPhoneDto,
  VerifyPhoneOtpDto,
} from '../dto/kyc.dto';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';
import { KycQuestion } from '../types';

@ApiTags('GnosisPay - KYC')
@Controller('api/v1/kyc')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPayKycController {
  constructor(
    private readonly gnosisPayKycService: GnosisPayKycService,
    private readonly httpService: GnosisPayHttpService,
  ) {}

  @Get('questions')
  @ApiOperation({
    summary: 'Get KYC questions (Source of Funds questionnaire)',
  })
  @ApiResponse({
    status: 200,
    description: 'KYC questions retrieved successfully',
  })
  async getKycQuestions(
    @GnosisPayToken() token: string,
  ): Promise<KycQuestion[]> {
    return await this.gnosisPayKycService.getKycQuestions(token);
  }

  @Post('answers')
  @ApiOperation({ summary: 'Submit KYC answers' })
  @ApiResponse({
    status: 200,
    description: 'KYC answers submitted successfully',
  })
  async submitKycAnswers(
    @GnosisPayToken() token: string,
    @Body() dto: SubmitKycAnswersDto,
  ): Promise<void> {
    await this.gnosisPayKycService.submitKycAnswers(token, dto.answers);
  }

  @Get('access-token')
  @ApiOperation({ summary: 'Get Sumsub access token for KYC verification' })
  @ApiResponse({
    status: 200,
    description: 'Access token retrieved successfully',
  })
  async getKycAccessToken(
    @GnosisPayToken() token: string,
  ): Promise<{ token: string }> {
    const accessToken = await this.gnosisPayKycService.getKycAccessToken(token);
    return { token: accessToken };
  }

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status for the current user' })
  @ApiResponse({
    status: 200,
    description: 'KYC status retrieved successfully',
  })
  async getKycStatus(
    @GnosisPayToken() token: string,
  ): Promise<{ kycStatus: string }> {
    const status = await this.gnosisPayKycService.getKycStatus(token);
    return { kycStatus: status };
  }

  @Get('flow-status')
  @ApiOperation({ summary: 'Get complete KYC flow status (custom endpoint)' })
  @ApiResponse({
    status: 200,
    description: 'KYC flow status retrieved successfully',
  })
  async getKycFlowStatus(@GnosisPayToken() token: string): Promise<{
    kycStatus: string;
    isSourceOfFundsAnswered: boolean;
    isPhoneValidated: boolean;
    hasAccessToken: boolean;
  }> {
    return await this.gnosisPayKycService.getKycFlowStatus(token);
  }

  // ===== KYC INTEGRATION (OFFICIAL API) =====
  @Get('integration')
  @ApiOperation({ summary: 'Get KYC integration configuration (Sumsub)' })
  @ApiResponse({
    status: 200,
    description: 'KYC integration configuration retrieved successfully',
    schema: {
      properties: {
        applicantId: { type: 'string', description: 'Sumsub applicant ID' },
        reviewStatus: { type: 'string', description: 'Review status' },
        reviewResult: { type: 'object', description: 'Review result details' },
        integrationConfig: {
          type: 'object',
          description: 'Integration configuration',
        },
      },
    },
  })
  async getKycIntegration(
    @GnosisPayToken() token: string,
    @Query('lang') lang?: string,
  ): Promise<any> {
    return await this.httpService.getKycIntegration(token, lang);
  }

  @Get('integration/sdk')
  @ApiOperation({ summary: 'Get Sumsub SDK access token for KYC integration' })
  @ApiResponse({
    status: 200,
    description: 'SDK access token retrieved successfully',
    schema: {
      properties: {
        token: { type: 'string', description: 'Sumsub SDK access token' },
      },
    },
  })
  async getKycIntegrationSdk(
    @GnosisPayToken() token: string,
    @Query('lang') lang?: string,
  ): Promise<{ token: string }> {
    return await this.httpService.getKycAccessToken(token, lang);
  }

  // ===== MEDIUM PRIORITY - KYC PARTNER INTEGRATION =====
  @Post('import-partner-applicant')
  @ApiOperation({
    summary: 'Retrieve KYC Sharing Token for partner applicant import',
  })
  @ApiResponse({
    status: 200,
    description: 'Partner applicant imported successfully',
    schema: {
      properties: {
        sharingToken: {
          type: 'string',
          description: 'KYC sharing token for partner integration',
        },
        applicantId: { type: 'string', description: 'Imported applicant ID' },
        status: { type: 'string', description: 'Import status' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid applicant ID or partner not authorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Applicant not found in partner system',
  })
  async importPartnerApplicant(
    @GnosisPayToken() token: string,
    @Body() body: { applicantId: string },
  ): Promise<any> {
    return await this.httpService.importPartnerApplicant(
      token,
      body.applicantId,
    );
  }
}
