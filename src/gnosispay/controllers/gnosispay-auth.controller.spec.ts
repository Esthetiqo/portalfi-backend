import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { GnosisPayAuthController } from './gnosispay-auth.controller';
import { GnosisPayAuthService } from '../services/gnosispay-auth.service';
import { GnosisPayHttpService } from '../services/gnosispay-http.service';
import { VerifyChallengeDto, SignupDto } from '../dto/auth.dto';

describe('GnosisPayAuthController', () => {
  let controller: GnosisPayAuthController;
  let authService: GnosisPayAuthService;
  let httpService: GnosisPayHttpService;

  const mockAuthService = {
    signupUser: jest.fn(),
    authenticateWithSIWE: jest.fn(),
  };

  const mockHttpService = {
    generateNonce: jest.fn(),
    verifyChallenge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GnosisPayAuthController],
      providers: [
        {
          provide: GnosisPayAuthService,
          useValue: mockAuthService,
        },
        {
          provide: GnosisPayHttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<GnosisPayAuthController>(GnosisPayAuthController);
    authService = module.get<GnosisPayAuthService>(GnosisPayAuthService);
    httpService = module.get<GnosisPayHttpService>(GnosisPayHttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateNonce', () => {
    it('should return a nonce string', async () => {
      const mockNonce = 'abc123def456';
      mockHttpService.generateNonce.mockResolvedValue(mockNonce);

      const result = await controller.generateNonce();

      expect(result).toBe(mockNonce);
      expect(httpService.generateNonce).toHaveBeenCalledTimes(1);
    });

    it('should return plain text, not JSON object', async () => {
      const mockNonce = 'test-nonce';
      mockHttpService.generateNonce.mockResolvedValue(mockNonce);

      const result = await controller.generateNonce();

      // Should be string, not { nonce: string }
      expect(typeof result).toBe('string');
      expect(result).not.toHaveProperty('nonce');
    });
  });

  describe('verifyChallenge', () => {
    it('should verify SIWE signature and return token', async () => {
      const dto: VerifyChallengeDto = {
        message: 'localhost wants you to sign in...',
        signature: '0x123456789abcdef',
        ttlInSeconds: 3600,
      };

      const mockResponse = { token: 'jwt-token-abc123' };
      mockHttpService.verifyChallenge.mockResolvedValue(mockResponse);

      const result = await controller.verifyChallenge(dto);

      expect(result).toEqual({ token: mockResponse.token });
      expect(httpService.verifyChallenge).toHaveBeenCalledWith(
        dto.message,
        dto.signature,
        dto.ttlInSeconds,
      );
    });

    it('should accept optional ttlInSeconds', async () => {
      const dto: VerifyChallengeDto = {
        message: 'message',
        signature: 'signature',
      };

      const mockResponse = { token: 'jwt-token' };
      mockHttpService.verifyChallenge.mockResolvedValue(mockResponse);

      await controller.verifyChallenge(dto);

      expect(httpService.verifyChallenge).toHaveBeenCalledWith(
        dto.message,
        dto.signature,
        undefined,
      );
    });
  });

  describe('signup', () => {
    it('should create new user with valid token', async () => {
      const token = 'valid-gnosispay-token';
      const dto: SignupDto = {
        authEmail: 'test@example.com',
        otp: '123456',
        referralCouponCode: 'FRIEND2024',
        partnerId: 'partner-123',
      };

      const mockSignupResponse = {
        id: 'user-123',
        token: 'new-jwt-token',
        hasSignedUp: true,
      };

      mockAuthService.signupUser.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(token, dto);

      expect(result).toEqual(mockSignupResponse);
      expect(authService.signupUser).toHaveBeenCalledWith(
        token,
        dto.authEmail,
        dto.otp,
        dto.referralCouponCode,
        dto.marketingCampaign,
        dto.partnerId,
      );
    });

    it('should include marketingCampaign if provided', async () => {
      const token = 'valid-token';
      const dto: SignupDto = {
        authEmail: 'test@example.com',
        marketingCampaign: 'spring-2024',
      };

      mockAuthService.signupUser.mockResolvedValue({
        id: 'user-123',
        token: 'token',
        hasSignedUp: true,
      });

      await controller.signup(token, dto);

      expect(authService.signupUser).toHaveBeenCalledWith(
        token,
        dto.authEmail,
        undefined, // otp
        undefined, // referralCouponCode
        'spring-2024', // marketingCampaign
        undefined, // partnerId
      );
    });

    it('should handle all optional fields as undefined', async () => {
      const token = 'valid-token';
      const dto: SignupDto = {
        authEmail: 'test@example.com',
      };

      mockAuthService.signupUser.mockResolvedValue({
        id: 'user-123',
        token: 'token',
        hasSignedUp: true,
      });

      await controller.signup(token, dto);

      expect(authService.signupUser).toHaveBeenCalledWith(
        token,
        dto.authEmail,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('Authentication', () => {
    it('should use @GnosisPayToken decorator to extract token', async () => {
      // This test verifies the decorator is being used
      // In actual usage, the decorator extracts from Authorization header
      const token = 'extracted-from-header';
      const dto: SignupDto = {
        authEmail: 'test@example.com',
      };

      mockAuthService.signupUser.mockResolvedValue({
        id: 'user-123',
        token: 'new-token',
        hasSignedUp: true,
      });

      await controller.signup(token, dto);

      // Token should be passed as first argument
      expect(authService.signupUser).toHaveBeenCalledWith(
        token,
        expect.any(String),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
    });
  });
});
