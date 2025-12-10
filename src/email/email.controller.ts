import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmailPreviewTemplate, EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-example')
  async sendExample(
    @Body() body: { to: string; name: string; language?: string },
  ) {
    await this.emailService.sendWelcomeEmail(body.to, body.name, body.language);
    return { status: 'ok' };
  }

  @Get('preview-example')
  async previewExample(
    @Query('name') name = 'Daniel',
    @Query('language') language?: string,
    @Query('template') template?: EmailPreviewTemplate,
  ) {
    const selectedTemplate =
      template && Object.values(EmailPreviewTemplate).includes(template)
        ? template
        : EmailPreviewTemplate.Welcome;

    const html = await this.emailService.previewExampleEmail(
      name,
      language,
      selectedTemplate,
    );
    return html;
  }
}
