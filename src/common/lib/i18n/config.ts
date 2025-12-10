import { createInstance, type i18n, type InitOptions } from 'i18next';
import {
  DEFAULT_LANGUAGE,
  EMAIL_NAMESPACES,
  type SupportedLanguage,
  SMS_NAMESPACES,
} from './constants';

import enMarketing from './translations/en/email.json';
import esMarketing from './translations/es/email.json';
import ptMarketing from './translations/pt-PT/email.json';
import enSms from './translations/en/sms.json';
import esSms from './translations/es/sms.json';
import ptSms from './translations/pt-PT/sms.json';

const resourcesEmail = {
  en: {
    [EMAIL_NAMESPACES.MARKETING]: enMarketing,
  },
  es: {
    [EMAIL_NAMESPACES.MARKETING]: esMarketing,
  },
  'pt-PT': {
    [EMAIL_NAMESPACES.MARKETING]: ptMarketing,
  },
};

const resourcesSms = {
  en: {
    [SMS_NAMESPACES.CORE]: enSms,
  },
  es: {
    [SMS_NAMESPACES.CORE]: esSms,
  },
  'pt-PT': {
    [SMS_NAMESPACES.CORE]: ptSms,
  },
};

async function initializeI18n(
  instance: ReturnType<typeof createInstance>,
  options: InitOptions,
): Promise<i18n> {
  try {
    await instance.init(options);
    return instance;
  } catch (error) {
    throw new Error(
      `Failed to initialize i18n: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export const createEmailI18n = (language: SupportedLanguage): Promise<i18n> => {
  const i18nInstance = createInstance();

  return initializeI18n(i18nInstance, {
    resources: resourcesEmail,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: EMAIL_NAMESPACES.MARKETING,
    ns: [EMAIL_NAMESPACES.MARKETING],
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });
};

export const createSmsI18n = (language: SupportedLanguage): Promise<i18n> => {
  const i18nInstance = createInstance();

  return initializeI18n(i18nInstance, {
    resources: resourcesSms,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: SMS_NAMESPACES.CORE,
    ns: [SMS_NAMESPACES.CORE],
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });
};
