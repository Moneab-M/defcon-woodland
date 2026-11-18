/**
 * @file LocationFallback.jsx
 * @description A reassuring message shown on the Map page when the visitor's
 * location is denied, unavailable or not supported, with two ways to still
 * meet the trees: scan a sign or pick a tree from the list.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-60 | SRS: [ID 104], [ID 204]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router: https://reactrouter.com
 *
 * Notes:
 * - Announced politely to screen readers. No pop-up, no timer.
 * - Never blames the visitor and never shows technical words or coordinates.
 */

import { Link } from "react-router-dom";
import { useText } from "../i18n/useText";
import { BUTTON_CLASSES } from "./controlStyles";

/**
 * Purpose: Show the location fallback message and its two links.
 * Parameters: reason ("denied" | "unavailable" | "unsupported").
 */
export default function LocationFallback({ reason }) {
  const t = useText();
  if (!["denied", "unavailable", "unsupported"].includes(reason)) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-cy="location-fallback"
      className="mx-auto max-w-6xl my-3 px-4 py-3 rounded-xl border border-black/10 dark:border-white/20"
    >
      <p className="text-lg leading-[1.2] mb-3" data-cy="location-fallback-message">
        {t(`map.locationFallback.${reason}`)}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/trees#scan" className={BUTTON_CLASSES} data-cy="location-fallback-scan">
          {t("map.locationFallback.scan")}
        </Link>
        <Link to="/trees" className={BUTTON_CLASSES} data-cy="location-fallback-list">
          {t("map.locationFallback.list")}
        </Link>
      </div>
    </div>
  );
}
