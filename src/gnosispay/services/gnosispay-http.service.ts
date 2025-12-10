import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  NonceResponse,
  ChallengeResponse,
  SignupResponse,
  AccountBalanceResponse,
  CreateSafeResponse,
  SignaturePayloadResponse,
  DeploySafeModulesResponse,
  User,
  Card,
  Event,
  KycQuestion,
  MoneriumIntegrationResponse,
  SafeConfig,
  DelayTransaction,
} from '../types';

@Injectable()
export class GnosisPayHttpService {
  private readonly client: AxiosInstance;
  private readonly baseURL: string;

  constructor(private configService: ConfigService) {
    this.baseURL =
      this.configService.get<string>('GNOSISPAY_API_URL') ||
      'https://api.gnosispay.com';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.error || error.message;
        throw new HttpException(message, error.response?.status || 500);
      },
    );
  }

  private getAuthHeaders(token: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // ==================== Authentication ====================

  async generateNonce(): Promise<string> {
    const response = await this.client.get<string>('/api/v1/auth/nonce');
    return response.data;
  }

  async verifyChallenge(
    message: string,
    signature: string,
    ttlInSeconds?: number,
  ): Promise<ChallengeResponse> {
    const response = await this.client.post<ChallengeResponse>(
      '/api/v1/auth/challenge',
      {
        message,
        signature,
        ttlInSeconds,
      },
    );
    return response.data;
  }

  async signup(
    token: string,
    authEmail: string,
    otp?: string,
    referralCouponCode?: string,
    marketingCampaign?: string,
    partnerId?: string,
  ): Promise<SignupResponse> {
    const response = await this.client.post<SignupResponse>(
      '/api/v1/auth/signup',
      {
        authEmail,
        otp,
        referralCouponCode,
        marketingCampaign,
        partnerId,
      },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async requestSignupOtp(email: string): Promise<void> {
    await this.client.post('/api/v1/auth/signup/otp', { email });
  }

  // ==================== User Management ====================

  async getUser(token: string): Promise<User> {
    const response = await this.client.get<User>(
      '/api/v1/user',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async updateUser(token: string, userData: Partial<User>): Promise<User> {
    const response = await this.client.patch<User>(
      '/api/v1/user',
      userData,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  // ==================== Account Management ====================

  async getAccountBalance(token: string): Promise<AccountBalanceResponse> {
    const response = await this.client.get<AccountBalanceResponse>(
      '/api/v1/account-balances',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getSafeConfig(token: string): Promise<SafeConfig> {
    const response = await this.client.get<SafeConfig>(
      '/api/v1/safe/config',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getDailyLimit(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/accounts/daily-limit',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async setDailyLimit(
    token: string,
    newLimit: string,
    signature: string,
  ): Promise<any> {
    const response = await this.client.put(
      '/api/v1/accounts/daily-limit',
      { newLimit, signature },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getDailyLimitTransactionData(
    token: string,
    newLimit: string,
  ): Promise<any> {
    const response = await this.client.get(
      '/api/v1/accounts/daily-limit/transaction-data',
      {
        ...this.getAuthHeaders(token),
        params: { newLimit },
      },
    );
    return response.data;
  }

  async withdrawFromSafe(
    token: string,
    tokenAddress: string,
    to: string,
    amount: string,
    signature: string,
  ): Promise<any> {
    const response = await this.client.post(
      '/api/v1/accounts/withdraw',
      { tokenAddress, to, amount, signature },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getWithdrawTransactionData(
    token: string,
    tokenAddress: string,
    to: string,
    amount: string,
  ): Promise<any> {
    const response = await this.client.get(
      '/api/v1/accounts/withdraw/transaction-data',
      {
        ...this.getAuthHeaders(token),
        params: { tokenAddress, to, amount },
      },
    );
    return response.data;
  }

  // EOA Accounts
  async getEoaAccounts(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/eoa-accounts',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async addEoaAccount(
    token: string,
    address: string,
    message: string,
    signature: string,
  ): Promise<any> {
    const response = await this.client.post(
      '/api/v1/eoa-accounts',
      { address, message, signature },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async removeEoaAccount(token: string, id: string): Promise<void> {
    await this.client.delete(
      `/api/v1/eoa-accounts/${id}`,
      this.getAuthHeaders(token),
    );
  }

  // ==================== Safe Management ====================

  async createSafe(
    token: string,
    chainId: number,
  ): Promise<CreateSafeResponse> {
    const response = await this.client.post<CreateSafeResponse>(
      '/api/v1/account',
      { chainId: chainId.toString() },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getSignaturePayload(token: string): Promise<SignaturePayloadResponse> {
    const response = await this.client.get<SignaturePayloadResponse>(
      '/api/v1/account/signature-payload',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async deploySafeModules(
    token: string,
    signature: string,
  ): Promise<DeploySafeModulesResponse> {
    const response = await this.client.patch<DeploySafeModulesResponse>(
      '/api/v1/account/deploy-safe-modules',
      { signature },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getDelayTransactions(token: string): Promise<DelayTransaction[]> {
    const response = await this.client.get<DelayTransaction[]>(
      '/api/v1/delay-relay',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async deploySafe(token: string): Promise<any> {
    const response = await this.client.post(
      '/api/v1/safe/deploy',
      {},
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getSafeDeploymentStatus(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/safe/deploy',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async resetSafe(token: string): Promise<void> {
    await this.client.delete('/api/v1/safe/reset', this.getAuthHeaders(token));
  }

  // Safe Owners
  async getSafeOwners(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/owners',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async addSafeOwner(
    token: string,
    newOwner: string,
    signature: string,
  ): Promise<any> {
    const response = await this.client.post(
      '/api/v1/owners',
      { newOwner, signature },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async removeSafeOwner(
    token: string,
    ownerToRemove: string,
    signature: string,
  ): Promise<any> {
    const response = await this.client.delete('/api/v1/owners', {
      ...this.getAuthHeaders(token),
      data: { ownerToRemove, signature },
    });
    return response.data;
  }

  async getAddOwnerTransactionData(
    token: string,
    newOwner: string,
  ): Promise<any> {
    const response = await this.client.get(
      '/api/v1/owners/add/transaction-data',
      {
        ...this.getAuthHeaders(token),
        params: { newOwner },
      },
    );
    return response.data;
  }

  async getRemoveOwnerTransactionData(
    token: string,
    ownerToRemove: string,
  ): Promise<any> {
    const response = await this.client.get(
      '/api/v1/owners/remove/transaction-data',
      {
        ...this.getAuthHeaders(token),
        params: { ownerToRemove },
      },
    );
    return response.data;
  }

  // ==================== Card Management ====================

  async getCards(token: string): Promise<Card[]> {
    const response = await this.client.get<Card[]>(
      '/api/v1/cards',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getCardById(token: string, cardId: string): Promise<Card> {
    const response = await this.client.get<Card>(
      `/api/v1/cards/${cardId}`,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async createVirtualCard(token: string): Promise<Card> {
    const response = await this.client.post<Card>(
      '/api/v1/cards/virtual',
      {},
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async activateCard(token: string, cardId: string): Promise<void> {
    await this.client.post(
      `/api/v1/cards/${cardId}/activate`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async freezeCard(token: string, cardId: string): Promise<void> {
    await this.client.post(
      `/api/v1/cards/${cardId}/freeze`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async unfreezeCard(token: string, cardId: string): Promise<void> {
    await this.client.post(
      `/api/v1/cards/${cardId}/unfreeze`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async reportCardLost(token: string, cardId: string): Promise<void> {
    await this.client.post(
      `/api/v1/cards/${cardId}/lost`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async reportCardStolen(token: string, cardId: string): Promise<void> {
    await this.client.post(
      `/api/v1/cards/${cardId}/stolen`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async voidCard(token: string, cardId: string): Promise<void> {
    await this.client.post(
      `/api/v1/cards/${cardId}/void`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async getCardStatus(token: string, cardId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v1/cards/${cardId}/status`,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getCardTransactions(
    token: string,
    params?: {
      cardTokens?: string[];
      limit?: number;
      offset?: number;
      before?: string;
      after?: string;
      billingCurrency?: string;
      transactionCurrency?: string;
      mcc?: string;
      transactionType?: string;
    },
  ): Promise<any> {
    const response = await this.client.get('/api/v1/cards/transactions', {
      ...this.getAuthHeaders(token),
      params,
    });
    return response.data;
  }

  // ==================== KYC ====================

  async getKycQuestions(token: string): Promise<KycQuestion[]> {
    const response = await this.client.get<KycQuestion[]>(
      '/api/v1/kyc/questions',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async submitKycAnswers(
    token: string,
    answers: Array<{ question: string; answer: string }>,
  ): Promise<void> {
    await this.client.post(
      '/api/v1/kyc/answers',
      { answers },
      this.getAuthHeaders(token),
    );
  }

  async getKycAccessToken(
    token: string,
    lang?: string,
  ): Promise<{ token: string }> {
    const response = await this.client.get<{ token: string }>(
      '/api/v1/kyc/integration/sdk',
      {
        ...this.getAuthHeaders(token),
        params: { lang },
      },
    );
    return response.data;
  }

  async getKycIntegration(token: string, lang?: string): Promise<any> {
    const response = await this.client.get('/api/v1/kyc/integration', {
      ...this.getAuthHeaders(token),
      params: { lang },
    });
    return response.data;
  }

  async importPartnerApplicant(
    token: string,
    applicantId: string,
  ): Promise<any> {
    const response = await this.client.post(
      '/api/v1/kyc/import-partner-applicant',
      { applicantId },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getSourceOfFunds(token: string, locale?: string): Promise<any> {
    const response = await this.client.get('/api/v1/source-of-funds', {
      ...this.getAuthHeaders(token),
      params: { locale },
    });
    return response.data;
  }

  async submitSourceOfFunds(token: string, answers: any): Promise<void> {
    await this.client.post(
      '/api/v1/source-of-funds',
      answers,
      this.getAuthHeaders(token),
    );
  }

  async requestVerificationOtp(
    token: string,
    phoneNumber: string,
  ): Promise<void> {
    await this.client.post(
      '/api/v1/verification',
      { phoneNumber },
      this.getAuthHeaders(token),
    );
  }

  async verifyPhoneWithOtp(token: string, code: string): Promise<void> {
    await this.client.post(
      '/api/v1/verification/check',
      { code },
      this.getAuthHeaders(token),
    );
  }

  // ==================== IBAN / Monerium ====================

  async createMoneriumIntegration(
    token: string,
    signature: string,
    accounts: any[],
  ): Promise<MoneriumIntegrationResponse> {
    const response = await this.client.post<MoneriumIntegrationResponse>(
      '/api/v1/integrations/monerium',
      { signature, accounts },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getIbanAvailability(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/ibans/available',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getIbanDetails(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/ibans/details',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getIbanOrders(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/ibans/orders',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getIbanSigningMessage(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/ibans/signing-message',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getIbanOauthRedirectUrl(
    token: string,
    callbackUrl: string,
  ): Promise<any> {
    const response = await this.client.get('/api/v1/ibans/oauth/redirect_url', {
      ...this.getAuthHeaders(token),
      params: { callbackUrl },
    });
    return response.data;
  }

  async createMoneriumProfile(
    token: string,
    callbackUrl: string,
  ): Promise<any> {
    const response = await this.client.post(
      '/api/v1/ibans/monerium-profile',
      { callbackUrl },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async resetIban(token: string): Promise<void> {
    await this.client.delete('/api/v1/ibans/reset', this.getAuthHeaders(token));
  }

  // ==================== Phone Validation ====================

  async sendPhoneVerification(token: string, phone: string): Promise<void> {
    await this.client.post(
      '/api/v1/user/phone/send-otp',
      { phone },
      this.getAuthHeaders(token),
    );
  }

  async verifyPhoneOtp(token: string, otp: string): Promise<void> {
    await this.client.post(
      '/api/v1/user/phone/verify-otp',
      { otp },
      this.getAuthHeaders(token),
    );
  }

  // ==================== Physical Card Orders ====================

  async createPhysicalCardOrder(token: string, orderData: any): Promise<any> {
    const response = await this.client.post(
      '/api/v1/order/create',
      orderData,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getCardOrder(token: string, orderId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v1/order/${orderId}`,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async cancelCardOrder(token: string, orderId: string): Promise<void> {
    await this.client.post(
      `/api/v1/order/${orderId}/cancel`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async confirmCardOrderPayment(token: string, orderId: string): Promise<void> {
    await this.client.put(
      `/api/v1/order/${orderId}/confirm-payment`,
      {},
      this.getAuthHeaders(token),
    );
  }

  async getCardOrders(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/order/',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async attachCouponToOrder(
    token: string,
    orderId: string,
    couponCode: string,
  ): Promise<any> {
    const response = await this.client.post(
      `/api/v1/order/${orderId}/attach-coupon`,
      { couponCode },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async attachTransactionToOrder(
    token: string,
    orderId: string,
    transactionHash: string,
  ): Promise<any> {
    const response = await this.client.put(
      `/api/v1/order/${orderId}/attach-transaction`,
      { transactionHash },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async createPhysicalCard(token: string, orderId: string): Promise<any> {
    const response = await this.client.post(
      `/api/v1/order/${orderId}/create-card`,
      {},
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  // ==================== Safe Management (Modern) ====================

  async setSafeCurrency(token: string, currency: string): Promise<void> {
    await this.client.post(
      '/api/v1/safe/set-currency',
      { currency },
      this.getAuthHeaders(token),
    );
  }

  async getSupportedCurrencies(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/safe/supported-currencies',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async createSafeTransaction(
    token: string,
    transactionData: any,
  ): Promise<any> {
    const response = await this.client.post(
      '/api/v1/safe/transactions',
      transactionData,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  // ==================== Rewards / Cashback ====================

  async getRewards(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/rewards',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async acceptRewardsTerms(token: string, version: string): Promise<void> {
    await this.client.post(
      '/api/v1/user/terms',
      { type: 'rewards', version },
      this.getAuthHeaders(token),
    );
  }

  async getCashback(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/cashback',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  // ==================== Transactions ====================

  async getTransactions(token: string, params?: any): Promise<any[]> {
    const response = await this.client.get('/api/v1/transactions', {
      ...this.getAuthHeaders(token),
      params,
    });
    return response.data;
  }

  async getTransaction(token: string, transactionId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v1/transactions/${transactionId}`,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getDisputeReasons(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/transactions/dispute',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async disputeTransaction(
    token: string,
    threadId: string,
    reason: string,
    description?: string,
  ): Promise<any> {
    const response = await this.client.post(
      `/api/v1/transactions/${threadId}/dispute`,
      { reason, description },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  // ==================== Webhooks ====================

  async getWebhooks(token: string): Promise<any[]> {
    const response = await this.client.get(
      '/api/v1/webhooks',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async createWebhook(token: string, webhookData: any): Promise<any> {
    const response = await this.client.post(
      '/api/v1/webhooks',
      webhookData,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async getWebhook(token: string, webhookId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v1/webhooks/${webhookId}`,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async updateWebhook(
    token: string,
    webhookId: string,
    webhookData: any,
  ): Promise<any> {
    const response = await this.client.patch(
      `/api/v1/webhooks/${webhookId}`,
      webhookData,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async deleteWebhook(token: string, webhookId: string): Promise<void> {
    await this.client.delete(
      `/api/v1/webhooks/${webhookId}`,
      this.getAuthHeaders(token),
    );
  }

  async getWebhookMessage(token: string, partnerId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v1/webhooks/message/${partnerId}`,
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async subscribeWebhook(
    token: string,
    partnerId: string,
    url: string,
    signature: string,
    events: string[],
  ): Promise<any> {
    const response = await this.client.post(
      `/api/v1/webhooks/subscribe/${partnerId}`,
      { url, signature, events },
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  // ==================== User Terms & Conditions ====================

  async getUserTermsStatus(token: string): Promise<any> {
    const response = await this.client.get(
      '/api/v1/user/terms',
      this.getAuthHeaders(token),
    );
    return response.data;
  }

  async acceptUserTerms(
    token: string,
    type: string,
    version: string,
  ): Promise<void> {
    await this.client.post(
      '/api/v1/user/terms',
      { type, version },
      this.getAuthHeaders(token),
    );
  }
}
