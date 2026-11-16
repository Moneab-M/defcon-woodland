/**
 * @file useText.js
 * @description The "Localized Page & Tree Text Lookup": gives components the
 * Page Text for the Selected Language from the Multilingual Content Store.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 101], [ID 201], [ID 410]
 * Architecture: Page Text & UI View -> Localized Page & Tree Text Lookup -> Multilingual Content Store
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React hooks: https://react.dev/reference/react/useCallback
 * - Vite env variables (import.meta.env.DEV): https://vite.dev/guide/env-and-mode
 *
 * Notes:
 * - Dictionaries are imported statically, so switching language is a normal
 *   synchronous re-render with no network request ([ID 201]).
 * - Languages that are not verified (languageStatus.js) show English ([ID 410]).
 *
 * Usage:
 *   const t = useText();
 *   <h1>{t("home.hero.title")}</h1>
 */

import { useCallback } from "react";
import { useLanguage, DEFAULT_LANGUAGE } from "../context/LanguageContext";
import { isLanguageVerified } from "./languageStatus";
import en from "./en";
import fr from "./fr";
import mic from "./mic";

// ---------- Global constants ----------
export const DICTIONARIES = { en, fr, mic };
const FALLBACK_LANGUAGE = DEFAULT_LANGUAGE; // English
const IS_DEV = import.meta.env.DEV;         // warnings only while developing

/**
 * Purpose: Read a nested value from a dictionary using a dotted key.
 *
 * Parameters:
 * - dictionary: one of the language objects, e.g. en
 * - key: dotted path, e.g. "common.nav.home"
 *
 * Returns: the value at that path, or undefined if any part is missing
 */
function getByPath(dictionary, key) {
  return key
    .split(".")
    .reduce((node, part) => (node == null ? undefined : node[part]), dictionary);
}

/**
 * Purpose: Replace every {name} in a text with values.name.
 *
 * Parameters:
 * - text: the looked-up value (only strings are changed)
 * - values: optional object, e.g. { name: "Ana" }
 *
 * Returns: the text with placeholders filled in. Non-strings are returned
 * unchanged, and a placeholder with no matching value stays as written.
 */
function fillPlaceholders(text, values) {
  if (typeof text !== "string" || !values) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
  );
}

/**
 * Purpose: Choose which language's text to show for the Selected Language.
 *
 * Parameters:
 * - language: the Selected Language code
 *
 * Returns: the language code itself if it is verified and has a dictionary,
 * otherwise "en"
 */
export function getDisplayLanguage(language) {
  return isLanguageVerified(language) && DICTIONARIES[language]
    ? language
    : FALLBACK_LANGUAGE;
}

/**
 * Purpose: Find the Page Text for one key in the Selected Language.
 *
 * Parameters:
 * - language: the Selected Language code
 * - key: dotted path, e.g. "common.nav.home"
 * - values: optional object for {name} placeholders
 *
 * Returns: the text (or list) for that key
 *
 * Pseudo-code:
 * 1. Work out the display language (unverified languages become English).
 * 2. If it is not English, return its text when the key exists; otherwise
 *    warn (development only) and fall back to English.
 * 3. Return the English text, or the key itself if English is missing too,
 *    so the gap is visible while testing.
 */
export function lookupText(language, key, values) {
  const displayLanguage = getDisplayLanguage(language);

  if (displayLanguage !== FALLBACK_LANGUAGE) {
    const value = getByPath(DICTIONARIES[displayLanguage], key);
    if (value !== undefined) return fillPlaceholders(value, values);
    if (IS_DEV) {
      console.warn(`[useText] Missing "${displayLanguage}" text for "${key}"; showing English.`);
    }
  }

  const englishValue = getByPath(DICTIONARIES[FALLBACK_LANGUAGE], key);
  if (englishValue !== undefined) return fillPlaceholders(englishValue, values);

  if (IS_DEV) console.warn(`[useText] Missing English text for "${key}".`);
  return key;
}

/**
 * Purpose: Hook that gives a component the t() lookup function.
 *
 * Parameters:
 * - None (reads the Selected Language through useLanguage())
 *
 * Returns: t(key, values), which returns the Page Text for key in the Selected
 * Language; values is an optional object that fills {name} placeholders
 */
export function useText() {
  const { language } = useLanguage();
  return useCallback((key, values) => lookupText(language, key, values), [language]);
}
