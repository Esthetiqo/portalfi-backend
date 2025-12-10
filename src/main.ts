import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Get PrismaService instance for interceptors and filters
  const prismaService = app.get(PrismaService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(prismaService));

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(prismaService),
    new AuditInterceptor(prismaService),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('GnosisPay Integration API')
    .setDescription(
      `Complete API for GnosisPay integration with authentication, KYC, cards, and transactions.

## Features
- 🔐 SIWE (Sign-In With Ethereum) Authentication
- 👤 User Management
- 📋 KYC Verification with Sumsub
- 💳 Virtual & Physical Card Management
- 💰 Safe & Account Management
- 📊 Transaction History
- 🪝 Webhooks
- 🎁 Rewards & Cashback

## Authentication
All endpoints (except /auth/nonce and /auth/challenge) require Bearer token authentication.

1. Get nonce: \`GET /api/v1/auth/nonce\`
2. Sign message with wallet
3. Verify: \`POST /api/v1/auth/challenge\`
4. Use returned token in Authorization header: \`Bearer <token>\`

## Base URL
- Development: http://localhost:3000
- Production: https://api.yourdomain.com

## Error Handling
All errors return consistent JSON format:
\`\`\`json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2025-10-25T12:00:00.000Z",
  "path": "/api/v1/endpoint"
}
\`\`\`

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Support
- Documentation: https://docs.gnosispay.com
- GitHub: https://github.com/yourusername/gnosispay-backend
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'GnosisPay Integration Team',
      'https://gnosispay.com',
      'support@gnosispay.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token obtained from /api/v1/auth/challenge',
        in: 'header',
      },
      'bearerAuth',
    )
    .addTag('GnosisPay - Authentication', 'SIWE authentication and user signup')
    .addTag(
      'GnosisPay - User Management',
      'User profile and phone verification',
    )
    .addTag(
      'GnosisPay - Account Management',
      'Account balances and Safe configuration',
    )
    .addTag('GnosisPay - Cards', 'Virtual and physical card management')
    .addTag('GnosisPay - KYC', 'Know Your Customer verification process')
    .addTag(
      'GnosisPay - Physical Card Orders',
      'Order and manage physical cards',
    )
    .addTag(
      'GnosisPay - Safe Management',
      'Safe wallet and currency management',
    )
    .addTag('GnosisPay - Rewards & Cashback', 'Rewards program and cashback')
    .addTag('GnosisPay - Transactions', 'Transaction history and details')
    .addTag('GnosisPay - Webhooks', 'Webhook configuration and management')
    .addServer('http://localhost:3000', 'Local Development')
    .addServer('https://api-staging.yourdomain.com', 'Staging')
    .addServer('https://api.yourdomain.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'GnosisPay API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  logger.log(`🔍 Health check: http://localhost:${port}/health`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
