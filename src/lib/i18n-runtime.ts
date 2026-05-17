/**
 * Module-level bridge so non-React code (API hooks, toast helpers) can
 * translate strings without holding a React context. The active translator
 * is registered by `I18nProvider` on mount / locale change.
 */
import type { ApiError, FieldErrorInfo } from "./api";

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

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in params ? String(params[k]) : `{${k}}`));
}

/**
 * Resolve a per-field validation error in the active locale. Accepts either
 * a `FieldErrorInfo` (preferred) or a plain string for back-compat.
 * Falls back to the server-provided English message when the key is unknown.
 */
export function translateFieldError(
  info: FieldErrorInfo | string | undefined,
  t: Translator = currentTranslator,
): string | undefined {
  if (!info) return undefined;
  if (typeof info === "string") return info;
  if (!info.i18nKey) return info.message;
  const translated = t(info.i18nKey);
  if (translated === info.i18nKey) return info.message;
  return interpolate(translated, info.params);
}