export const SUPPORTED_LANGUAGES = {
  en: { translationKey: 'en' as const },
  es: { translationKey: 'es' as const },
  'pt-PT': {
    name: 'Portuguese',
    translationKey: 'ptPT' as const,
  },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const EMAIL_NAMESPACES = {
  MARKETING: 'email-marketing',
} as const;

export type EmailNamespace =
  (typeof EMAIL_NAMESPACES)[keyof typeof EMAIL_NAMESPACES];

export const SMS_NAMESPACES = {
  CORE: 'sms',
} as const;

export type SmsNamespace = (typeof SMS_NAMESPACES)[keyof typeof SMS_NAMESPACES];
