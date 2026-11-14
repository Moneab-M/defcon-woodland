/**
 * @file TreeNearbyPrompt.jsx
 * @description A friendly prompt shown on the Map page when the visitor is
 * inside the Proximity Range of a Talking Tree. It names the tree and offers
 * the sign scanner, the tree's page, or "Not now".
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-59 | SRS: [ID 104], [ID 204]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router: https://reactrouter.com
 *
 * Notes:
 * - Announced politely to screen readers. No timer: it stays until dismissed
 *   or the visitor leaves the range (the parent stops rendering it).
 * - It never shows a distance or coordinates.
 */

import { Link } from "react-router-dom";
import { useText } from "../i18n/useText";
import { BUTTON_CLASSES } from "./controlStyles";

/**
 * Purpose: Show the "a tree is near" prompt.
 * Parameters: tree (entry from TALKING_TREES), onDismiss (called by "Not now").
 */
export default function TreeNearbyPrompt({ tree, onDismiss }) {
  const t = useText();
  if (!tree) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-cy="tree-nearby-prompt"
      className="mx-auto max-w-6xl my-3 px-4 py-3 rounded-xl border border-black/10 dark:border-white/20"
    >
      <p className="text-lg leading-[1.2] mb-3">
        {t("trees.nearby.message", { name: t(`trees.species.${tree.species}.name`) })}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/trees#scan" className={BUTTON_CLASSES} data-cy="tree-nearby-scan">
          {t("trees.nearby.scan")}
        </Link>
        <Link to={`/trees/${tree.id}`} className={BUTTON_CLASSES} data-cy="tree-nearby-meet">
          {t("trees.nearby.meet")}
        </Link>
        <button type="button" onClick={onDismiss} className={BUTTON_CLASSES} data-cy="tree-nearby-dismiss">
          {t("trees.nearby.dismiss")}
        </button>
      </div>
    </div>
  );
}
