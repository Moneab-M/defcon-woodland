/**
 * @file usePrefersReducedMotion.js
 * @description Small hook that says whether the visitor asked their device for less motion.
 * It listens for changes and is safe when matchMedia is missing.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-68 | SRS: WCAG 2.2.2 (Pause, Stop, Hide), WCAG 2.3.3
 */

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Purpose: read the current setting once (false when matchMedia is not available).
function readPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  const mql = window.matchMedia(QUERY);
  return !!(mql && mql.matches);
}

// Purpose: return true when the visitor prefers reduced motion; updates if the setting changes.
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(readPreference);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const mql = window.matchMedia(QUERY);
    if (!mql || typeof mql.addEventListener !== "function") return undefined;
    const onChange = (e) => setReduced(!!e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
