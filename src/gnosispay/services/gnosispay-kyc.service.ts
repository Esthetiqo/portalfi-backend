import { Injectable } from '@nestjs/common';
import { GnosisPayHttpService } from './gnosispay-http.service';
import { KycQuestion, KycAnswer, User } from '../types';

@Injectable()
export class GnosisPayKycService {
  constructor(private readonly gnosisPayHttp: GnosisPayHttpService) {}

  /**
   * Get KYC questions (Source of Funds questionnaire)
   */
  async getKycQuestions(token: string): Promise<KycQuestion[]> {
    return await this.gnosisPayHttp.getKycQuestions(token);
  }

  /**
   * Submit KYC answers
   */
  async submitKycAnswers(token: string, answers: KycAnswer[]): Promise<void> {
    await this.gnosisPayHttp.submitKycAnswers(token, answers);
  }

  /**
   * Get Sumsub access token for KYC verification
   * This token is used to initialize the Sumsub SDK on the frontend
   */
  async getKycAccessToken(token: string): Promise<string> {
    const response = await this.gnosisPayHttp.getKycAccessToken(token);
    return response.token;
  }

  /**
   * Check user KYC status
   */
  async getKycStatus(token: string): Promise<string> {
    const user = await this.gnosisPayHttp.getUser(token);
    return user.kycStatus;
  }

  /**
   * Verify phone number (required for KYC)
   */
  async sendPhoneVerification(token: string, phone: string): Promise<void> {
    await this.gnosisPayHttp.sendPhoneVerification(token, phone);
  }

  /**
   * Verify OTP sent to phone
   */
  async verifyPhoneOtp(token: string, otp: string): Promise<void> {
    await this.gnosisPayHttp.verifyPhoneOtp(token, otp);
  }

  /**
   * Complete KYC flow
   * Returns the complete flow status
   */
  async getKycFlowStatus(token: string): Promise<{
    kycStatus: string;
    isSourceOfFundsAnswered: boolean;
    isPhoneValidated: boolean;
    hasAccessToken: boolean;
  }> {
    const user = await this.gnosisPayHttp.getUser(token);

    let hasAccessToken = false;
    try {
      await this.gnosisPayHttp.getKycAccessToken(token);
      hasAccessToken = true;
    } catch {
      hasAccessToken = false;
    }

    return {
      kycStatus: user.kycStatus,
      isSourceOfFundsAnswered: user.isSourceOfFundsAnswered,
      isPhoneValidated: user.isPhoneValidated,
      hasAccessToken,
    };
  }
}
