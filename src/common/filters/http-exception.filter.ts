import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Global exception filter for handling all HTTP exceptions
 * Provides consistent error responses and logging
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly prisma?: PrismaService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error:
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? (exceptionResponse as any).error || exceptionResponse
          : message,
      requestId: (request as any).id || 'unknown',
    };

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace',
    );

    // Log to database if PrismaService is available
    if (this.prisma) {
      try {
        await this.logErrorToDatabase(request, exception, status, message);
      } catch (dbError) {
        this.logger.error('Failed to log error to database', dbError);
      }
    }

    response.status(status).json(errorResponse);
  }

  private async logErrorToDatabase(
    request: Request,
    exception: unknown,
    status: number,
    message: string,
  ) {
    if (!this.prisma) return; // Skip if no prisma service

    try {
      const user = (request as any).user;
      const stack = exception instanceof Error ? exception.stack : null;

      // Note: Requires migration to schema-new.prisma for errorLog model
      // Uncomment after migrating to schema-new.prisma:
      /*
      await this.prisma.errorLog.create({
        data: {
          userId: user?.id,
          level: status >= 500 ? 'critical' : status >= 400 ? 'error' : 'warning',
          message: message,
          stack: stack,
          code: status.toString(),
          endpoint: request.url,
          method: request.method,
          params: request.params || {},
          body: this.sanitizeBody(request.body),
          headers: this.sanitizeHeaders(request.headers),
          ipAddress: request.ip,
          userAgent: request.get('user-agent'),
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version,
        },
      });
      */
      this.logger.warn('Error logging to database disabled - migrate to schema-new.prisma to enable');
    } catch (error) {
      this.logger.error('Error logging to database:', error);
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};
    const sanitized = { ...body };
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'privateKey'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    if (!headers) return {};
    const sanitized = { ...headers };
    // Remove sensitive headers
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
    });
    return sanitized;
  }
}
