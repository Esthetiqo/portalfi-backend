import { Injectable } from '@nestjs/common';
import { GnosisPayHttpService } from './gnosispay-http.service';
import { SiweMessage } from 'siwe';
import { Wallet } from 'ethers';

@Injectable()
export class GnosisPayAuthService {
  constructor(private readonly gnosisPayHttp: GnosisPayHttpService) {}

  /**
   * Complete SIWE authentication flow
   * @param privateKey - Private key of the wallet (for testing/backend usage)
   * @param address - Ethereum address
   * @param domain - Domain of your application
   * @returns JWT token for GnosisPay API
   */
  async authenticateWithSIWE(privateKey: string, address: string, domain: string): Promise<string> {
    // Step 1: Get nonce from GnosisPay
    const nonce = await this.gnosisPayHttp.generateNonce();

    // Step 2: Create SIWE message
    const siweMessage = new SiweMessage({
      domain,
      address,
      statement: 'Sign in with Ethereum to GnosisPay',
      uri: `https://${domain}`,
      version: '1',
      chainId: 100, // Gnosis Chain
      nonce,
    });

    const message = siweMessage.prepareMessage();

    // Step 3: Sign the message
    const wallet = new Wallet(privateKey);
    const signature = await wallet.signMessage(message);

    // Step 4: Verify challenge with GnosisPay
    const response = await this.gnosisPayHttp.verifyChallenge(message, signature);

    return response.token;
  }

  /**
   * Sign up a new user after authentication
   */
  async signupUser(
    token: string,
    email: string,
    otp?: string,
    referralCode?: string,
    marketingCampaign?: string,
    partnerId?: string,
  ): Promise<{ id: string; token: string; hasSignedUp: boolean }> {
    return await this.gnosisPayHttp.signup(token, email, otp, referralCode, marketingCampaign, partnerId);
  }

  /**
   * Generate authentication URL for frontend
   */
  generateAuthUrl(address: string, domain: string): { message: string; nonce: string } {
    // This would be used in a frontend flow
    // For now, we return a placeholder
    return {
      message: 'Use authenticateWithSIWE method for backend authentication',
      nonce: '',
    };
  }
}
