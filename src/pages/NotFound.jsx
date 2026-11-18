/**
 * @file NotFound.jsx
 * @description Friendly "off the trail" page shown for any address that
 * matches no page. One heading, a reassuring sentence and links back to
 * Home, the Map and the Talking Trees.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-74 | SRS: WCAG 2.1 AA 2.4.2, [ID 317]
 *
 * Notes:
 * - Focus moves to the heading on mount so screen-reader and keyboard users
 *   know where they are. The browser tab title comes from PageTitle.
 * - Text comes from src/i18n (notFound.*). No bold, colours are inherited.
 */

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useText } from "../i18n/useText";
import { BUTTON_CLASSES } from "../Components/controlStyles";

/**
 * Purpose: Show the friendly page for an unknown address.
 *
 * Returns: the page content
 */
function NotFound() {
  const t = useText();
  const headingRef = useRef(null);

  // Move focus to the heading when the page appears.
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, []);

  return (
    <section data-cy="not-found" className="mx-auto max-w-2xl px-4 py-12 text-lg leading-[1.2]">
      <h1
        ref={headingRef}
        tabIndex={-1}
        data-cy="not-found-heading"
        className="text-3xl leading-[1.2] mb-4 focus:outline-none"
      >
        {t("notFound.heading")}
      </h1>
      <p className="mb-6">{t("notFound.text")}</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/" data-cy="not-found-home" className={BUTTON_CLASSES}>
          {t("notFound.home")}
        </Link>
        <Link to="/map" data-cy="not-found-map" className={BUTTON_CLASSES}>
          {t("notFound.map")}
        </Link>
        <Link to="/trees" data-cy="not-found-trees" className={BUTTON_CLASSES}>
          {t("notFound.trees")}
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
