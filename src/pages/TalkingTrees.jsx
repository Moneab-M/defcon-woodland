/**
 * @file TalkingTrees.jsx
 * @description The Talking Trees page: a short explanation for children and a
 * list of every Talking Tree, each a link to its own page.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-54, SCRUM-55, SCRUM-76 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router Link: https://reactrouter.com/en/main/components/link
 *
 * Notes:
 * - Needs no location. The camera is used only if the visitor opens the
 *   sign scanner and agrees. Only the IDs of scanned trees are kept, on this
 *   device (SCRUM-76).
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useText } from "../i18n/useText";
import { TALKING_TREES } from "../talkingTrees/trees";
import { getFoundTrees, resetFoundTrees } from "../talkingTrees/foundTrees"; // SCRUM-76
import { BUTTON_CLASSES } from "../Components/controlStyles";
import QrScanner from "../Components/QrScanner";

/**
 * Purpose: Show the explanation and the list of Talking Trees.
 *
 * Returns: the page
 */
export default function TalkingTrees() {
  const t = useText();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [scanning, setScanning] = useState(false);
  const scanButtonRef = useRef(null);
  const listRef = useRef(null);
  const [found, setFound] = useState(() => getFoundTrees()); // SCRUM-76

  // The URL hash #scan moves focus to the scan button (the camera is never opened by itself).
  useEffect(() => {
    if (hash === "#scan" && scanButtonRef.current) scanButtonRef.current.focus();
  }, [hash]);

  /** Purpose: A sign was read: close the scanner and open that tree's page. */
  function handleFound(treeId) {
    setScanning(false);
    navigate(`/trees/${treeId}`, { state: { foundByScan: true } });
  }

  /** Purpose: "Start again": forget the found trees and update the list. */
  function handleReset() {
    resetFoundTrees();
    setFound([]);
  }

  /** Purpose: Close the scanner and put focus on the list of trees. */
  function handlePickFromList() {
    setScanning(false);
    if (listRef.current) listRef.current.focus();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8" data-cy="trees-page">
      <h1 className="text-3xl leading-[1.2] mb-4">{t("trees.page.title")}</h1>
      <p className="text-lg leading-[1.2] mb-6">{t("trees.page.intro")}</p>

      <button
        type="button"
        ref={scanButtonRef}
        className={`${BUTTON_CLASSES} mb-6`}
        onClick={() => setScanning(true)}
        data-cy="open-scanner"
      >
        {t("trees.scanner.open")}
      </button>
      <QrScanner
        open={scanning}
        onClose={() => setScanning(false)}
        onFound={handleFound}
        onPickFromList={handlePickFromList}
      />

      {found.length > 0 && (
        <p className="text-lg leading-[1.2] mb-3" data-cy="found-count">
          {t("trees.milestones.count", { count: found.length, total: TALKING_TREES.length })}
        </p>
      )}
      <ul ref={listRef} tabIndex={-1} aria-label={t("trees.page.listLabel")} className="flex flex-col items-start gap-3 list-none p-0 focus:outline-none">
        {TALKING_TREES.map((tree) => (
          <li key={tree.id} className="flex flex-wrap items-center gap-3">
            <Link to={`/trees/${tree.id}`} className={BUTTON_CLASSES} data-cy={`tree-link-${tree.id}`}>
              {t(`trees.species.${tree.species}.name`)}
            </Link>
            {found.includes(tree.id) && (
              <span className="inline-flex items-center gap-1 text-lg leading-[1.2]" data-cy={`tree-found-${tree.id}`}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
                  <path d="M2 18 C2 8 10 2 18 2 C18 12 12 18 2 18 Z" fill="#C9A227" stroke="#6B4F3A" strokeWidth="1" />
                </svg>
                {t("trees.milestones.found")}
              </span>
            )}
          </li>
        ))}
      </ul>
      {found.length > 0 && (
        <button type="button" className={`${BUTTON_CLASSES} mt-6`} onClick={handleReset} data-cy="reset-found-trees">
          {t("trees.milestones.reset")}
        </button>
      )}
    </section>
  );
}
