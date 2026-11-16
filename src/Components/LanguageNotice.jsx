/**
 * @file LanguageNotice.jsx
 * @description A small notice under the site header, shown when the visitor
 * chooses a language whose Page Text is not verified yet (Mi'kmaq). The page
 * then shows English text, and this notice says why.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 410], [ID 316]
 *
 * Notes:
 * - The notice is written in English on purpose (see en.js), so it carries
 *   lang="en" even though <html lang> is "mic".
 * - Text colour is inherited (black in Light Mode, pale yellow in Dark Mode): no Red, Green or Neon Colours ([ID 316]).
 */

import { useLanguage } from "../context/LanguageContext";
import { isLanguageVerified } from "../i18n/languageStatus";
import { useText } from "../i18n/useText";

/**
 * Purpose: Tell the visitor that the chosen language's text is not available yet.
 *
 * Parameters:
 * - None (reads the Selected Language through useLanguage())
 *
 * Returns: JSX.Element with the notice, or null when the language is verified
 */
export default function LanguageNotice() {
  const { language } = useLanguage();
  const t = useText();

  if (isLanguageVerified(language)) return null;

  return (
    <p
      role="status"
      lang="en"
      className="mx-auto max-w-7xl px-4 sm:px-6 pb-2 text-lg leading-[1.2]"
      data-cy="language-notice"
    >
      {t("common.languageNotice.micNotAvailable")}
    </p>
  );
}
