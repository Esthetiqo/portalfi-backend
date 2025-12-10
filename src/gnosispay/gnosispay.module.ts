import { Module } from '@nestjs/common';
import { GnosisPayHttpService } from './services/gnosispay-http.service';
import { GnosisPayAuthService } from './services/gnosispay-auth.service';
import { GnosisPayKycService } from './services/gnosispay-kyc.service';
import { GnosisPayCardService } from './services/gnosispay-card.service';
import { GnosisPayAuthController } from './controllers/gnosispay-auth.controller';
import { GnosisPayKycController } from './controllers/gnosispay-kyc.controller';
import { GnosisPayCardController } from './controllers/gnosispay-card.controller';
import { GnosisPayUserController } from './controllers/gnosispay-user.controller';
import {
  GnosisPayAccountController,
  GnosisPayAccountsController,
  GnosisPayEoaAccountsController,
} from './controllers/gnosispay-account.controller';
import { GnosisPayCardOrdersController } from './controllers/gnosispay-card-orders.controller';
import {
  GnosisPaySafeController,
  GnosisPaySafeOwnersController,
  GnosisPayDelayRelayController,
  GnosisPayAccountSetupController,
} from './controllers/gnosispay-safe.controller';
import {
  GnosisPayRewardsController,
  GnosisPayCashbackController,
  GnosisPayUserTermsController,
} from './controllers/gnosispay-rewards.controller';
import { GnosisPayTransactionsController } from './controllers/gnosispay-transactions.controller';
import { GnosisPayWebhooksController } from './controllers/gnosispay-webhooks.controller';
import {
  GnosisPayIbanController,
  GnosisPayMoneriumController,
} from './controllers/gnosispay-iban.controller';
import { GnosisPayVerificationController } from './controllers/gnosispay-verification.controller';
import { GnosisPaySourceOfFundsController } from './controllers/gnosispay-source-of-funds.controller';

@Module({
  providers: [
    GnosisPayHttpService,
    GnosisPayAuthService,
    GnosisPayKycService,
    GnosisPayCardService,
  ],
  controllers: [
    GnosisPayAuthController,
    GnosisPayKycController,
    GnosisPayCardController,
    GnosisPayUserController,
    GnosisPayAccountController,
    GnosisPayAccountsController,
    GnosisPayEoaAccountsController,
    GnosisPayCardOrdersController,
    GnosisPaySafeController,
    GnosisPaySafeOwnersController,
    GnosisPayDelayRelayController,
    GnosisPayAccountSetupController,
    GnosisPayRewardsController,
    GnosisPayCashbackController,
    GnosisPayUserTermsController,
    GnosisPayTransactionsController,
    GnosisPayWebhooksController,
    GnosisPayIbanController,
    GnosisPayMoneriumController,
    GnosisPayVerificationController,
    GnosisPaySourceOfFundsController,
  ],
  exports: [
    GnosisPayHttpService,
    GnosisPayAuthService,
    GnosisPayKycService,
    GnosisPayCardService,
  ],
})
export class GnosisPayModule {}
