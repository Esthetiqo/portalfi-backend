import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './constants';

export const isSupportedLanguage = (
  language: string | null | undefined,
): language is SupportedLanguage => {
  return !!language && language in SUPPORTED_LANGUAGES;
};

export const normalizeLanguage = (
  language: string | null | undefined,
): SupportedLanguage => {
  if (!language) return DEFAULT_LANGUAGE;

  if (isSupportedLanguage(language)) {
    return language;
  }

  const base = language.split('-')[0];
  if (isSupportedLanguage(base)) {
    return base;
  }

  return DEFAULT_LANGUAGE;
};
