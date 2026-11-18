/**
 * @file TalkingTrees.jsx
 * @description The Talking Trees page: a short explanation for children and a
 * list of every Talking Tree, each a link to its own page.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-54, SCRUM-55 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router Link: https://reactrouter.com/en/main/components/link
 *
 * Notes:
 * - Needs no location. The camera is used only if the visitor opens the
 *   sign scanner and agrees. Nothing is stored.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useText } from "../i18n/useText";
import { TALKING_TREES } from "../talkingTrees/trees";
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

  // The URL hash #scan moves focus to the scan button (the camera is never opened by itself).
  useEffect(() => {
    if (hash === "#scan" && scanButtonRef.current) scanButtonRef.current.focus();
  }, [hash]);

  /** Purpose: A sign was read: close the scanner and open that tree's page. */
  function handleFound(treeId) {
    setScanning(false);
    navigate(`/trees/${treeId}`, { state: { foundByScan: true } });
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

      <ul ref={listRef} tabIndex={-1} aria-label={t("trees.page.listLabel")} className="flex flex-col items-start gap-3 list-none p-0 focus:outline-none">
        {TALKING_TREES.map((tree) => (
          <li key={tree.id}>
            <Link to={`/trees/${tree.id}`} className={BUTTON_CLASSES} data-cy={`tree-link-${tree.id}`}>
              {t(`trees.species.${tree.species}.name`)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
