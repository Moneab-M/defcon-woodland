/**
 * @file PageTitle.jsx
 * @description Sets document.title to "<page name> | <site name>" for the
 * current route, in the Selected Language, so every page has its own title.
 * Renders nothing.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-52 | SRS: WCAG 2.1 AA 2.4.2 Page Titled
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router useLocation: https://reactrouter.com/en/main/hooks/use-location
 *
 * Notes:
 * - Paths are matched case-insensitively. Unknown paths use common.pageTitle.notFound.
 * - Re-runs when the language changes, so no reload is needed.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useText } from "../i18n/useText";
import { getTreeById } from "../talkingTrees/trees"; // SCRUM-54: tree page title

// ---------- Global constants ----------
const TITLE_KEYS = {
  "/": "common.nav.home",
  "/about": "common.nav.about",
  "/gallery": "common.nav.gallery",
  "/ecosystem": "common.nav.ecosystem",
  "/naturalburial": "common.nav.naturalBurial",
  "/contacts": "common.nav.contact",
  "/map": "common.nav.map",
  "/trees": "common.nav.trees",
};
const NOT_FOUND_KEY = "common.pageTitle.notFound";

/**
 * Purpose: Keep the browser tab title in step with the route and language.
 *
 * Returns: null (nothing is drawn)
 */
function PageTitle() {
  const t = useText();
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    // SCRUM-54: /trees/<id> is titled with the species name (list title if the id is unknown)
    const treeMatch = path.match(/^\/trees\/([^/]+)$/i);
    const tree = treeMatch ? getTreeById(decodeURIComponent(treeMatch[1])) : null;
    const pageName = tree
      ? t(`trees.species.${tree.species}.name`)
      : t(TITLE_KEYS[path.toLowerCase()] || (treeMatch ? "common.nav.trees" : NOT_FOUND_KEY));
    document.title = `${pageName} | ${t("common.siteName")}`;
  }, [pathname, t]);

  return null;
}

export default PageTitle;
