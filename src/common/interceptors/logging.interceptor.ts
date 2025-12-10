import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Logging interceptor for tracking all requests and responses
 * Logs to both console and database for complete traceability
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params, headers, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const user = (request as any).user;
    const startTime = Date.now();

    // Generate request ID
    const requestId = this.generateRequestId();
    (request as any).id = requestId;

    // Log incoming request
    this.logger.log(
      `[${requestId}] ${method} ${url} - User: ${user?.id || 'Anonymous'} - IP: ${ip}`,
    );

    return next.handle().pipe(
      tap({
        next: async (data) => {
          const responseTime = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log successful response
          this.logger.log(
            `[${requestId}] ${method} ${url} - ${statusCode} - ${responseTime}ms`,
          );

          // Log to database
          await this.logRequestToDatabase({
            method,
            endpoint: url,
            path: request.path,
            query,
            params,
            body: this.sanitizeBody(body),
            headers: this.sanitizeHeaders(headers),
            userId: user?.id,
            sessionId: (request as any).sessionId,
            statusCode,
            responseTime,
            ipAddress: ip,
            userAgent,
          });

          // Log to audit trail for important actions
          if (this.isImportantAction(method, url)) {
            await this.logToAudit(request, user, statusCode, responseTime);
          }
        },
        error: async (error) => {
          const responseTime = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(
            `[${requestId}] ${method} ${url} - ${statusCode} - ${responseTime}ms - Error: ${error.message}`,
          );

          // Log failed request to database
          await this.logRequestToDatabase({
            method,
            endpoint: url,
            path: request.path,
            query,
            params,
            body: this.sanitizeBody(body),
            headers: this.sanitizeHeaders(headers),
            userId: user?.id,
            sessionId: (request as any).sessionId,
            statusCode,
            responseTime,
            ipAddress: ip,
            userAgent,
          });
        },
      }),
    );
  }

  private async logRequestToDatabase(data: any) {
    try {
      // Note: Requires migration to schema-new.prisma for requestLog model
      // Uncomment after migrating to schema-new.prisma:
      // await this.prisma.requestLog.create({ data });

      // For now, just log to console in development
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(
          'Request logged (DB logging disabled until schema migration)',
        );
      }
    } catch (error) {
      this.logger.error('Failed to log request to database:', error);
    }
  }

  private async logToAudit(
    request: Request,
    user: any,
    statusCode: number,
    duration: number,
  ) {
    try {
      const action = this.extractAction(request.method, request.url);
      const resource = this.extractResource(request.url);

      // Note: Requires migration to schema-new.prisma for auditLog model
      // Uncomment after migrating to schema-new.prisma:
      /*
      await this.prisma.auditLog.create({
        data: {
          userId: user?.id,
          actorType: user ? 'user' : 'anonymous',
          actorId: user?.id,
          action,
          resource,
          resourceId: (request.params as any)?.id,
          description: `${request.method} ${request.url}`,
          metadata: {
            body: this.sanitizeBody(request.body),
            query: request.query,
            params: request.params,
          },
          ipAddress: request.ip,
          userAgent: request.get('user-agent'),
          method: request.method,
          endpoint: request.url,
          status: statusCode >= 200 && statusCode < 300 ? 'success' : 'failure',
          statusCode,
          duration,
        },
      });
      */
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};
    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'privateKey',
      'signature',
    ];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
    });
    return sanitized;
  }

  private isImportantAction(method: string, url: string): boolean {
    const importantPatterns = [
      '/auth/login',
      '/auth/signup',
      '/auth/logout',
      '/cards',
      '/kyc',
      '/account',
      '/safe',
      '/webhooks',
    ];

    return (
      method !== 'GET' &&
      importantPatterns.some((pattern) => url.includes(pattern))
    );
  }

  private extractAction(method: string, url: string): string {
    const methodMap: Record<string, string> = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };
    return methodMap[method] || 'unknown';
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1]?.split('?')[0] || 'unknown';
  }
}
