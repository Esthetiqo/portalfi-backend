import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { GnosisPayAuthGuard } from '../../common/guards/gnosispay-auth.guard';
import { GnosisPayToken } from '../../common/decorators/gnosispay-token.decorator';

@ApiTags('GnosisPay - Source of Funds (KYC)')
@Controller('api/v1/source-of-funds')
@UseGuards(GnosisPayAuthGuard)
@ApiBearerAuth()
export class GnosisPaySourceOfFundsController {
  constructor(private readonly httpService: GnosisPayHttpService) {}

  @Get()
  @ApiOperation({ summary: 'Get Source of Funds questionnaire' })
  @ApiResponse({
    status: 200,
    description: 'Source of Funds questions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', description: 'Question ID' },
          question: { type: 'string', description: 'Question text' },
          type: { type: 'string', enum: ['single_choice', 'multiple_choice', 'text'], description: 'Question type' },
          required: { type: 'boolean', description: 'Whether question is required' },
          options: { type: 'array', items: { type: 'string' }, description: 'Available options for choice questions' },
        },
      },
    },
  })
  async getSourceOfFunds(
    @GnosisPayToken() token: string,
    @Query('locale') locale?: string,
  ): Promise<any> {
    return await this.httpService.getSourceOfFunds(token, locale);
  }

  @Post()
  @ApiOperation({ summary: 'Submit Source of Funds answers' })
  @ApiResponse({
    status: 200,
    description: 'Source of Funds answers submitted successfully',
    schema: {
      properties: {
        success: { type: 'boolean', description: 'Whether submission was successful' },
        status: { type: 'string', description: 'Submission status' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid answers or missing required fields' })
  async submitSourceOfFunds(
    @GnosisPayToken() token: string,
    @Body() answers: any,
  ): Promise<void> {
    await this.httpService.submitSourceOfFunds(token, answers);
  }
}
