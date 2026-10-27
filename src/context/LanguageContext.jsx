/**
 * @file LanguageContext.jsx
 * @description Stores the visitor's Selected Language (English, French or Mi'kmaq) for the
 * whole website, and remembers it when the visitor changes pages or reloads.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-6 | SRS: [ID 101], [ID 304]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Context: https://react.dev/reference/react/createContext
 *
 * Notes:
 * - This file only stores the language. The Language Selector control is SCRUM-7,
 *   and translated Page Text is SCRUM-8.
 * - "mic" is the ISO 639-3 code for Mi'kmaq.
 */

import { createContext, useContext, useEffect, useState } from "react";

// ---------- Global constants ----------
export const SUPPORTED_LANGUAGES = ["en", "fr", "mic"]; // English, French, Mi'kmaq
export const DEFAULT_LANGUAGE = "en";                   // [ID 101]: English on first visit
const STORAGE_KEY = "wc_selected_language";             // localStorage key

const LanguageContext = createContext(null);

/**
 * Purpose: Read the saved language from localStorage, falling back to the default.
 *
 * Parameters:
 * - None
 *
 * Returns: one of SUPPORTED_LANGUAGES
 */
function getStoredLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE; // storage blocked, e.g. private browsing
  }
}

/**
 * Purpose: Provide the Selected Language to every component inside it.
 *
 * Parameters:
 * - children: the components to wrap (the whole App)
 *
 * Pseudo-code:
 * 1. Start with the saved language, or English.
 * 2. When the language changes, save it and set <html lang="..."> for screen readers.
 * 3. Share { language, setLanguage } with all child components.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);

  // Change the language; ignore anything that is not a supported code
  const setLanguage = (lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) setLanguageState(lang);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* storage unavailable: language still works for this visit */
    }
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Purpose: Let any component read or change the Selected Language.
 *
 * Usage: const { language, setLanguage } = useLanguage();
 *
 * Returns: { language, setLanguage }
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}