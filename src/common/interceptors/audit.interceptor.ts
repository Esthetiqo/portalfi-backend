import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Audit interceptor for creating activity logs
 * Creates user-facing activity timeline entries
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return next.handle(); // Skip if no user
    }

    return next.handle().pipe(
      tap({
        next: async (data) => {
          await this.createActivityLog(request, user, data);
        },
      }),
    );
  }

  private async createActivityLog(request: any, user: any, responseData: any) {
    const activityType = this.getActivityType(request.method, request.url);

    if (!activityType) {
      return; // Skip non-important activities
    }

    try {
      const { title, description, icon } = this.getActivityDetails(
        activityType,
        request,
        responseData,
      );

      // Note: Requires migration to schema-new.prisma for activityLog model
      // Uncomment after migrating to schema-new.prisma:
      /*
      await this.prisma.activityLog.create({
        data: {
          userId: user.id,
          type: activityType,
          title,
          description,
          icon,
          metadata: {
            method: request.method,
            url: request.url,
            params: request.params,
            responseData: this.sanitizeData(responseData),
          },
        },
      });
      */
      this.logger.log(`Activity: ${title} - ${description}`);
    } catch (error) {
      this.logger.error('Failed to create activity log:', error);
    }
  }

  private getActivityType(method: string, url: string): string | null {
    // Map endpoints to activity types
    const patterns = [
      { pattern: /\/auth\/login$/i, type: 'login' },
      { pattern: /\/auth\/logout$/i, type: 'logout' },
      { pattern: /\/auth\/signup$/i, type: 'signup' },
      { pattern: /\/cards\/virtual$/i, method: 'POST', type: 'card_created' },
      { pattern: /\/cards\/[^/]+\/activate$/i, method: 'POST', type: 'card_activated' },
      { pattern: /\/cards\/[^/]+\/freeze$/i, method: 'POST', type: 'card_frozen' },
      { pattern: /\/cards\/[^/]+\/unfreeze$/i, method: 'POST', type: 'card_unfrozen' },
      { pattern: /\/cards\/[^/]+\/report-lost$/i, method: 'POST', type: 'card_reported_lost' },
      { pattern: /\/kyc\/answers$/i, method: 'POST', type: 'kyc_submitted' },
      { pattern: /\/card-orders\/physical$/i, method: 'POST', type: 'physical_card_ordered' },
      { pattern: /\/webhooks$/i, method: 'POST', type: 'webhook_created' },
      { pattern: /\/user$/i, method: 'PATCH', type: 'profile_updated' },
    ];

    for (const { pattern, method: requiredMethod, type } of patterns) {
      if (pattern.test(url) && (!requiredMethod || requiredMethod === method)) {
        return type;
      }
    }

    return null;
  }

  private getActivityDetails(
    type: string,
    request: any,
    responseData: any,
  ): { title: string; description: string; icon: string } {
    const details: Record<string, any> = {
      login: {
        title: 'Logged in',
        description: 'You logged into your account',
        icon: 'login',
      },
      logout: {
        title: 'Logged out',
        description: 'You logged out of your account',
        icon: 'logout',
      },
      signup: {
        title: 'Account created',
        description: 'Welcome! Your account has been created',
        icon: 'user-plus',
      },
      card_created: {
        title: 'Virtual card created',
        description: 'A new virtual card has been created',
        icon: 'credit-card',
      },
      card_activated: {
        title: 'Card activated',
        description: 'Your card has been activated',
        icon: 'check-circle',
      },
      card_frozen: {
        title: 'Card frozen',
        description: 'Your card has been temporarily frozen',
        icon: 'lock',
      },
      card_unfrozen: {
        title: 'Card unfrozen',
        description: 'Your card has been unfrozen',
        icon: 'unlock',
      },
      card_reported_lost: {
        title: 'Card reported lost',
        description: 'Your card has been reported as lost and blocked',
        icon: 'alert-triangle',
      },
      kyc_submitted: {
        title: 'KYC submitted',
        description: 'Your KYC information has been submitted for review',
        icon: 'file-text',
      },
      physical_card_ordered: {
        title: 'Physical card ordered',
        description: 'Your physical card order has been placed',
        icon: 'package',
      },
      webhook_created: {
        title: 'Webhook created',
        description: `Webhook created for ${responseData?.url || 'endpoint'}`,
        icon: 'webhook',
      },
      profile_updated: {
        title: 'Profile updated',
        description: 'Your profile information has been updated',
        icon: 'user',
      },
    };

    return details[type] || { title: type, description: '', icon: 'activity' };
  }

  private sanitizeData(data: any): any {
    if (!data) return null;
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'signature'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });
    return sanitized;
  }
}
