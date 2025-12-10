import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard to validate GnosisPay Bearer token presence
 * Can be used at controller or route level
 */
@Injectable()
export class GnosisPayAuthGuard implements CanActivate {
  private readonly logger = new Logger(GnosisPayAuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      this.logger.warn('Missing authorization header');
      throw new UnauthorizedException('Authorization header is required');
    }

    if (!authHeader.startsWith('Bearer ')) {
      this.logger.warn('Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format. Expected: Bearer <token>');
    }

    const token = authHeader.substring(7);

    if (!token || token.trim() === '') {
      this.logger.warn('Empty bearer token');
      throw new UnauthorizedException('Bearer token is empty');
    }

    // Attach token to request for later use
    request.gnosisPayToken = token;

    return true;
  }
}

/**
 * Decorator to mark a route as public (skips GnosisPayAuthGuard)
 */
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);
