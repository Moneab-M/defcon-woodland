/**
 * @file LanguageChangeMessage.jsx
 * @description A small confirmation shown at the top of the page after the
 * visitor changes the language during this visit. Written in the newly chosen
 * language. Never shown on first load, for a restored language, or for Mi'kmaq.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-75 | SRS: [ID 101], [ID 316], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React: https://react.dev
 * - React Router useLocation: https://reactrouter.com/en/main/hooks/use-location
 *
 * Notes:
 * - Polite status message (GentleMessage), never takes focus, no timer.
 * - Removed when dismissed or when the visitor goes to another page.
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useText } from "../i18n/useText";
import GentleMessage from "./GentleMessage";

/**
 * Purpose: Show the language confirmation after a language change.
 *
 * Returns: the message, or nothing
 */
export default function LanguageChangeMessage() {
  const { language } = useLanguage();
  const t = useText();
  const { pathname } = useLocation();
  const previous = useRef(language); // the language at first load (stored or default)
  const [visible, setVisible] = useState(false);

  // A later change of language shows the message (not for Mi'kmaq: its own notice explains)
  useEffect(() => {
    if (previous.current === language) return;
    previous.current = language;
    setVisible(language !== "mic");
  }, [language]);

  // Going to another page removes the message
  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-4" data-cy="language-confirmation">
      <GentleMessage kind="good" onDismiss={() => setVisible(false)}>
        {t("common.languageChanged")}
      </GentleMessage>
    </div>
  );
}
