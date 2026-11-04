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
 * - Translating the Page Text is SCRUM-8; choosing a language here does not
 *   change the page wording yet.
 * - Button styling copies the Light/Dark button in navi.jsx so controls of the
 *   same type look the same ([ID 317]). Colours are neutral black/white
 *   tints only: no Red, Green or Neon Colours ([ID 316]).
 * - Font is Calibri and weight 300 from the global rule in index.css
 *   ([ID 308], [ID 309]); no bold class is used here.
 * - PENDING CLIENT: the Mi'kmaq label and short code ("Mi'kmaq" / "MI'K") must be
 *   confirmed by the client before release ([ID 410]).
 */

import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";

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

// Same look as the Light/Dark button in navi.jsx ([ID 317])
const BASE_BUTTON_CLASSES =
  "inline-flex items-center gap-2 rounded-md border border-black/10 dark:border-white/20 " +
  "px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition";

// The selected button is underlined as well as shaded, so the choice is
// not shown by colour alone. The hover classes keep the shading the same
// on mouse-over (otherwise the lighter hover tint would replace it).
const SELECTED_BUTTON_CLASSES =
  "bg-black/10 dark:bg-white/20 hover:bg-black/10 dark:hover:bg-white/20 " +
  "underline underline-offset-4";

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

  return (
    <div
      role="group"
      aria-label="Language"
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
            className={`${BASE_BUTTON_CLASSES} ${isSelected ? SELECTED_BUTTON_CLASSES : ""}`}
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
