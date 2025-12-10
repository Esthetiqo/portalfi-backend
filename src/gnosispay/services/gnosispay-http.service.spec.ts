import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GnosisPayHttpService } from './gnosispay-http.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GnosisPayHttpService', () => {
  let service: GnosisPayHttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'GNOSISPAY_API_URL') return 'https://api.gnosispay.com';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GnosisPayHttpService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<GnosisPayHttpService>(GnosisPayHttpService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateNonce', () => {
    it('should return a nonce string', async () => {
      const mockNonce = 'test-nonce-123';
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({ data: mockNonce }),
        interceptors: {
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      // Recreate service to use mocked axios
      const module = await Test.createTestingModule({
        providers: [
          GnosisPayHttpService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testService =
        module.get<GnosisPayHttpService>(GnosisPayHttpService);
      const result = await testService.generateNonce();

      expect(result).toBe(mockNonce);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/auth/nonce');
    });
  });

  describe('verifyChallenge', () => {
    it('should verify SIWE signature and return token', async () => {
      const mockToken = 'jwt-token-123';
      const mockMessage = 'SIWE message';
      const mockSignature = '0xsignature';

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({
          data: { token: mockToken },
        }),
        interceptors: {
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      const module = await Test.createTestingModule({
        providers: [
          GnosisPayHttpService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testService =
        module.get<GnosisPayHttpService>(GnosisPayHttpService);
      const result = await testService.verifyChallenge(
        mockMessage,
        mockSignature,
      );

      expect(result.token).toBe(mockToken);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/auth/challenge',
        {
          message: mockMessage,
          signature: mockSignature,
          ttlInSeconds: undefined,
        },
      );
    });

    it('should accept custom ttlInSeconds', async () => {
      const mockToken = 'jwt-token-123';
      const ttl = 7200;

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({
          data: { token: mockToken },
        }),
        interceptors: {
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      const module = await Test.createTestingModule({
        providers: [
          GnosisPayHttpService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testService =
        module.get<GnosisPayHttpService>(GnosisPayHttpService);
      await testService.verifyChallenge('message', 'signature', ttl);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/auth/challenge',
        expect.objectContaining({
          ttlInSeconds: ttl,
        }),
      );
    });
  });

  describe('getUser', () => {
    it('should return user data with proper authorization', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        kycStatus: 'approved',
      };

      const mockToken = 'bearer-token-123';

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({ data: mockUser }),
        interceptors: {
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      const module = await Test.createTestingModule({
        providers: [
          GnosisPayHttpService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testService =
        module.get<GnosisPayHttpService>(GnosisPayHttpService);
      const result = await testService.getUser(mockToken);

      expect(result).toEqual(mockUser);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/user',
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }),
      );
    });
  });

  describe('getCards', () => {
    it('should return array of cards', async () => {
      const mockCards = [
        { id: 'card-1', lastFourDigits: '1234', virtual: true },
        { id: 'card-2', lastFourDigits: '5678', virtual: false },
      ];

      const mockToken = 'bearer-token-123';

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({ data: mockCards }),
        interceptors: {
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      const module = await Test.createTestingModule({
        providers: [
          GnosisPayHttpService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testService =
        module.get<GnosisPayHttpService>(GnosisPayHttpService);
      const result = await testService.getCards(mockToken);

      expect(result).toEqual(mockCards);
      expect(result).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    it('should throw HttpException on API error', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        message: 'Request failed',
      };

      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(mockError),
        interceptors: {
          response: {
            use: jest.fn((onSuccess, onError) => {
              // Simulate interceptor error handling
              return onError;
            }),
          },
        },
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      const module = await Test.createTestingModule({
        providers: [
          GnosisPayHttpService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testService =
        module.get<GnosisPayHttpService>(GnosisPayHttpService);

      await expect(testService.generateNonce()).rejects.toThrow();
    });
  });
});
