/**
 * Module-level bridge so non-React code (API hooks, toast helpers) can
 * translate strings without holding a React context. The active translator
 * is registered by `I18nProvider` on mount / locale change.
 */
import type { ApiError } from "./api";

type Translator = (key: string) => string;

let currentTranslator: Translator = (k) => k;

export function setTranslator(t: Translator) {
  currentTranslator = t;
}

export function translate(key: string): string {
  return currentTranslator(key);
}

/**
 * Resolve an ApiError's friendly message in the active locale.
 * Falls back to the original English `error.message` when the key is
 * unknown (e.g. a server-provided message we don't have a translation for).
 */
export function translateApiError(
  error: { i18nKey?: string; message: string } | ApiError,
  t: Translator = currentTranslator,
): string {
  const key = (error as ApiError).i18nKey;
  if (!key) return error.message;
  const translated = t(key);
  // If the translator returned the key itself, it had no entry — fall back.
  return translated === key ? error.message : translated;
}