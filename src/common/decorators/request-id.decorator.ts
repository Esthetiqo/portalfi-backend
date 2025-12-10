import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract request ID from request
 * Request ID is set by the logging interceptor
 */
export const RequestId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.id || 'unknown';
  },
);

/**
 * Decorator to extract user agent from request
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.get('user-agent') || 'unknown';
  },
);

/**
 * Decorator to extract IP address from request
 */
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress || 'unknown';
  },
);
