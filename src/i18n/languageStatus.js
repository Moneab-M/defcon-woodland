/**
 * @file languageStatus.js
 * @description Says which languages have verified Page Text that may be shown.
 * A language that is not verified shows English text instead.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 410]
 *
 * Notes:
 * - mic.verified flips to true ONLY after the client verifies the Mi'kmaq text
 *   as the St. Margaret's Bay dialect ([ID 410]). Do not change it before then.
 */

// ---------- Global constants ----------
export const LANGUAGE_STATUS = {
  en: { verified: true },
  fr: { verified: true }, // French is a DRAFT (see fr.js) but may be shown
  mic: { verified: false }, // PENDING CLIENT verification ([ID 410])
};

/**
 * Purpose: Check whether a language's Page Text may be shown.
 *
 * Parameters:
 * - language: a language code, e.g. "en", "fr" or "mic"
 *
 * Returns: true if the language is listed and verified, otherwise false
 */
export function isLanguageVerified(language) {
  return LANGUAGE_STATUS[language]?.verified === true;
}
