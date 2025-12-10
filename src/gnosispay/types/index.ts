// GnosisPay API Types - Strongly Typed Interfaces

export enum KYCStatus {
  NOT_STARTED = 'notStarted',
  DOCUMENTS_REQUESTED = 'documentsRequested',
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  RESUBMISSION_REQUESTED = 'resubmissionRequested',
  REJECTED = 'rejected',
  REQUIRES_ACTION = 'requiresAction',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum CardOrderStatus {
  PENDING_TRANSACTION = 'PENDINGTRANSACTION',
  TRANSACTION_COMPLETE = 'TRANSACTIONCOMPLETE',
  CONFIRMATION_REQUIRED = 'CONFIRMATIONREQUIRED',
  READY = 'READY',
  CARD_CREATED = 'CARDCREATED',
  FAILED_TRANSACTION = 'FAILEDTRANSACTION',
  CANCELLED = 'CANCELLED',
}

export enum TransactionStatus {
  UNSUBMITTED = 'Unsubmitted',
  UNCONFIRMED = 'Unconfirmed',
  EXEC_REVERTED = 'ExecReverted',
  EXEC_SUCCESS = 'ExecSuccess',
}

export enum PaymentStatus {
  APPROVED = 'Approved',
  INCORRECT_PIN = 'IncorrectPin',
  INSUFFICIENT_FUNDS = 'InsufficientFunds',
  EXCEEDS_APPROVAL_AMOUNT_LIMIT = 'ExceedsApprovalAmountLimit',
  INVALID_AMOUNT = 'InvalidAmount',
  PIN_ENTRY_TRIES_EXCEEDED = 'PinEntryTriesExceeded',
  INCORRECT_SECURITY_CODE = 'IncorrectSecurityCode',
  REVERSAL = 'Reversal',
  PARTIAL_REVERSAL = 'PartialReversal',
  OTHER = 'Other',
}

export enum AccountIntegrityStatus {
  OK = 0,
  SAFE_NOT_DEPLOYED = 1,
  SAFE_MISCONFIGURED = 2,
  ROLES_NOT_DEPLOYED = 3,
  ROLES_MISCONFIGURED = 4,
  DELAY_NOT_DEPLOYED = 5,
  DELAY_MISCONFIGURED = 6,
  DELAY_QUEUE_NOT_EMPTY = 7,
  UNEXPECTED_ERROR = 8,
}

export enum DelayTransactionStatus {
  QUEUING = 'QUEUING',
  WAITING = 'WAITING',
  EXECUTING = 'EXECUTING',
  EXECUTED = 'EXECUTED',
  FAILED = 'FAILED',
}

export enum OperationType {
  CALL = 'CALL',
  DELEGATECALL = 'DELEGATECALL',
}

export interface Authorization {
  userId: string;
  signerAddress?: string;
  chainId?: string;
  iat: number;
  exp: number;
  hasSignedUp: boolean;
}

export interface EOAAccount {
  id: string;
  address: string;
  userId: string;
  createdAt: string;
}

export interface SafeAccount {
  address: string;
  chainId?: string;
  tokenSymbol?: string;
  createdAt: string;
}

export interface Card {
  id: string;
  cardToken?: string;
  lastFourDigits: string;
  activatedAt?: string;
  virtual: boolean;
}

export interface CardOrder {
  id: string;
  transactionHash?: string;
  createdAt: string;
  status: CardOrderStatus;
  personalizationSource: 'KYC' | 'ENS';
  embossedName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  state?: string;
  couponCode?: string;
  totalAmountEUR?: number;
  totalDiscountEUR: number;
  virtual?: boolean;
}

export interface AccountAllowance {
  balance: string;
  refill: string;
  period: string;
  nextRefill?: string;
}

export interface SafeConfig {
  hasNoApprovals: boolean;
  isDeployed: boolean;
  address?: string;
  tokenSymbol?: string;
  fiatSymbol?: string;
  accountStatus?: AccountIntegrityStatus;
  accountAllowance?: AccountAllowance;
}

export interface DelayTransaction {
  id: string;
  safeAddress: string;
  transactionData: string;
  enqueueTaskId: string;
  dispatchTaskId?: string;
  readyAt?: string;
  operationType: OperationType;
  userId: string;
  status: DelayTransactionStatus;
  createdAt: string;
}

export interface BankingDetails {
  id: string;
  address: string;
  moneriumIban: string;
  moneriumBic: string;
  moneriumIbanStatus: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  nationalityCountry?: string;
  signInWallets: EOAAccount[];
  safeWallets: SafeAccount[];
  kycStatus: KYCStatus;
  availableFeatures?: {
    moneriumIban: boolean;
  };
  cards: Card[];
  bankingDetails?: BankingDetails;
  isSourceOfFundsAnswered: boolean;
  isPhoneValidated: boolean;
  partnerId?: string;
  status: 'ACTIVE' | 'DEACTIVATED';
}

export interface Currency {
  symbol: string;
  code: string;
  decimals: number;
  name: string;
}

export interface Country {
  name: string;
  numeric: string;
  alpha2: string;
  alpha3: string;
}

export interface Transaction {
  status: TransactionStatus;
  to: string;
  value: string;
  data: string;
  hash?: string;
}

export interface Merchant {
  name: string;
  city: string;
  country: Country;
}

export interface BasePayment {
  threadId: string;
  createdAt: string;
  clearedAt?: string;
  country: Country;
  isPending: boolean;
  impactsCashback?: boolean;
  mcc: string;
  merchant: Merchant;
  billingAmount: string;
  billingCurrency: Currency;
  transactionAmount: string;
  transactionCurrency: Currency;
  transactionType: string;
  cardToken: string;
  transactions: Transaction[];
}

export interface Payment extends BasePayment {
  kind: 'Payment';
  status: PaymentStatus;
}

export interface Refund extends BasePayment {
  kind: 'Refund';
  refundAmount: string;
  refundCurrency: Currency;
}

export interface Reversal extends BasePayment {
  kind: 'Reversal';
  reversalAmount: string;
  reversalCurrency: Currency;
}

export type Event = Payment | Refund | Reversal;

export interface KycQuestion {
  question: string;
  answers: string[];
}

export interface KycAnswer {
  question: string;
  answer: string;
}

export interface IbanOrder {
  id: string;
  kind: 'redeem' | 'issue';
  currency: 'eur' | 'usd' | 'gbp' | 'isk';
  amount: string;
  address: string;
  counterpart: {
    details: {
      name?: string;
    };
    identifier:
      | {
          standard: 'iban';
          iban: string;
        }
      | {
          standard: 'chain';
          address: string;
          chain: string;
        };
  };
  memo?: string;
  state: 'placed' | 'pending' | 'processed' | 'rejected';
  meta: {
    placedAt: string;
  };
}

// Request/Response DTOs

export interface NonceResponse {
  nonce: string;
}

export interface ChallengeRequest {
  message: string;
  signature: string;
  ttlInSeconds?: number;
}

export interface ChallengeResponse {
  token: string;
}

export interface SignupRequest {
  authEmail: string;
  otp?: string;
  referralCouponCode?: string;
  marketingCampaign?: string;
  partnerId?: string;
}

export interface SignupResponse {
  id: string;
  token: string;
  hasSignedUp: boolean;
}

export interface AccountBalanceResponse {
  total: string;
  spendable: string;
  pending: string;
}

export interface CreateSafeRequest {
  chainId: '100';
}

export interface CreateSafeResponse {
  id: string;
  address: string;
  userId: string;
  chainId: string;
  salt: string;
  createdAt: string;
  deployed: boolean;
  transactionHash?: string;
}

export interface SignaturePayloadResponse {
  domain: Record<string, any>;
  primaryType: string;
  types: Record<string, any>;
  message: Record<string, any>;
}

export interface DeploySafeModulesRequest {
  signature: string;
}

export interface DeploySafeModulesResponse {
  transactionHash: string;
  deployed: boolean;
}

export interface MoneriumIntegrationResponse {
  data: {
    success: boolean;
    status: number;
    description: string;
    responseData?: any;
    moneriumProfileId?: string;
    iban?: string;
    bic?: string;
    responseHeaders?: any;
  };
}

export interface TermsBody {
  terms:
    | 'general-tos'
    | 'card-monavate-tos'
    | 'cashback-tos'
    | 'privacy-policy';
  version: string;
}

export interface ErrorResponse {
  error: string;
}
