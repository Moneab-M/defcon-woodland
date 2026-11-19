/**
 * @file LanguageSelector.jsx
 * @description The on-screen Language Selector the Website Visitor uses to choose
 * English, French or Mi'kmaq. Shown in the site header next to the Light/Dark button.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-7 | SRS: [ID 304], [ID 308], [ID 309], [ID 316], [ID 317]
 * Architecture: Language & Theme Selection Input -> Language & Theme Controller
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React: https://react.dev
 * - Tailwind CSS utility classes: https://tailwindcss.com
 *
 * Notes:
 * - The Selected Language itself is stored by LanguageContext (SCRUM-6).
 *   This file only displays the control and calls setLanguage().
 * - Page Text is translated by useText() (SCRUM-8). The language names stay in
 *   each language's own name and are not translated.
 * - SCRUM-8: group label moved to src/i18n (Moneab Milad)
 * - SCRUM-69: buttons use the shared BUTTON_CLASSES (44 px minimum) from
 *   controlStyles.js so controls of the same type look the same ([ID 317]). Colours are neutral black/white
 *   tints only: no Red, Green or Neon Colours ([ID 316]).
 * - Font is Calibri and weight 300 from the global rule in index.css
 *   ([ID 308], [ID 309]); no bold class is used here.
 * - PENDING CLIENT: the Mi'kmaq label and short code ("Mi'kmaq" / "MI'K") must be
 *   confirmed by the client before release ([ID 410]).
 */

import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";
import { useText } from "../i18n/useText"; // SCRUM-8: Page Text lookup
import { BUTTON_CLASSES, BUTTON_SELECTED_CLASSES } from "./controlStyles"; // SCRUM-69: shared 44 px button look ([ID 317])

// ---------- Global constants ----------
// Each language is written in its own name, so visitors who do not read
// English can still find their language.
// code:  value stored by LanguageContext (must be in SUPPORTED_LANGUAGES)
// label: full name, shown on screens 1280 px (Tailwind xl) and wider, and read
//        by screen readers
// short: short code, shown below 1280 px so the header fits on laptop widths
//        next to the page links
export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "mic", label: "Mi'kmaq", short: "MI'K" }, // PENDING CLIENT: label wording ([ID 410])
].filter((option) => SUPPORTED_LANGUAGES.includes(option.code));

/**
 * Purpose: Display one button per supported language and change the
 * Selected Language when a button is activated.
 *
 * Parameters:
 * - None (reads and changes the language through useLanguage())
 *
 * Returns: JSX.Element, a labelled group of three buttons
 *
 * Pseudo-code:
 * 1. Read the current language from LanguageContext.
 * 2. For each language, draw a button; mark the current one with aria-pressed.
 * 3. On click, Enter or Space (native <button> behaviour), call setLanguage(code).
 */
export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const t = useText();

  return (
    <div
      role="group"
      aria-label={t("common.languageSelector.label")}
      className="flex items-center gap-1"
      data-cy="language-selector"
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isSelected = option.code === language;
        return (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            aria-label={option.label}
            aria-pressed={isSelected}
            onClick={() => setLanguage(option.code)}
            className={`${BUTTON_CLASSES} ${isSelected ? BUTTON_SELECTED_CLASSES : ""}`}
            data-cy={`language-option-${option.code}`}
          >
            <span className="hidden xl:inline">{option.label}</span>
            <span className="xl:hidden" aria-hidden="true">
              {option.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
