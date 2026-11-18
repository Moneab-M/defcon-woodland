/**
 * @file TreePage.jsx
 * @description One Talking Tree: its name, greeting and facts in the Selected
 * Language. An unknown tree ID shows a kind message and a link back to the list.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-54, SCRUM-57, SCRUM-76 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router useParams / Link: https://reactrouter.com/en/main/hooks/use-params
 *
 * Notes:
 * - Needs no location and no camera. Only the tree ID is remembered, on this
 *   device, when the tree was reached by scanning (SCRUM-76).
 */

import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useText } from "../i18n/useText";
import { getTreeById } from "../talkingTrees/trees";
import { markTreeFound } from "../talkingTrees/foundTrees"; // SCRUM-76
import { BUTTON_CLASSES } from "../Components/controlStyles";
import TreeCharacter from "../Components/TreeCharacter";
import TreeAudio from "../Components/TreeAudio";
import WoodlandGuide from "../Components/WoodlandGuide"; // SCRUM-77
import GentleMessage from "../Components/GentleMessage"; // SCRUM-75

/**
 * Purpose: Show the tree named by the :treeId part of the address.
 *
 * Returns: the page
 */
export default function TreePage() {
  const t = useText();
  const { treeId } = useParams();
  const tree = getTreeById(treeId);
  const [speaking, setSpeaking] = useState(false); // true while this tree's recording plays
  // SCRUM-75: the scanner sends { foundByScan: true }; a new visit has a new location.key
  const location = useLocation();
  const [dismissedKey, setDismissedKey] = useState(null);
  const showFound = location.state?.foundByScan === true && dismissedKey !== location.key;

  // SCRUM-76: remember a scanned tree; celebrate only when it is new (a reload keeps the router state)
  const [milestone, setMilestone] = useState(null);
  useEffect(() => {
    if (!tree || location.state?.foundByScan !== true) return;
    const result = markTreeFound(tree.id);
    if (result.isNew && (result.isFirst || result.isAll)) {
      setMilestone({ key: location.key, isFirst: result.isFirst, isAll: result.isAll });
    }
  }, [tree, location.key, location.state]);
  const celebrate = milestone && milestone.key === location.key ? milestone : null;

  // Back link shared by both views
  const backLink = (
    <Link to="/trees" className={BUTTON_CLASSES} data-cy="tree-back-link">
      {t("trees.page.backToList")}
    </Link>
  );

  if (!tree) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8" data-cy="tree-page">
        <h1 className="text-3xl leading-[1.2] mb-4">{t("trees.page.title")}</h1>
        <div className="flex items-center gap-3 mb-6">
          <WoodlandGuide size={56} />
          <p className="text-lg leading-[1.2]" data-cy="tree-unknown">{t("trees.page.unknown")}</p>
        </div>
        {backLink}
      </section>
    );
  }

  const facts = t(`trees.species.${tree.species}.facts`);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8" data-cy="tree-page">
      {showFound && (
        <div className="mb-4" data-cy="scan-confirmation">
          <GentleMessage kind="good" onDismiss={() => setDismissedKey(location.key)}>
            {t("trees.found", { name: t(`trees.species.${tree.species}.name`) })}
          </GentleMessage>
        </div>
      )}
      {celebrate && (
        <div className="mb-4 relative" data-cy="milestone">
          <span aria-hidden="true" className="pointer-events-none absolute -top-2 left-0 right-0 flex justify-around">
            {["", "milestone-leaf-2", "milestone-leaf-3"].map((extra, i) => (
              <svg key={i} className={`milestone-leaf ${extra}`} width="20" height="20" viewBox="0 0 20 20">
                <path d="M2 18 C2 8 10 2 18 2 C18 12 12 18 2 18 Z" fill={["#C9A227", "#B9772E", "#5F7A8A"][i]} />
              </svg>
            ))}
          </span>
          {celebrate.isFirst && (
            <div className="mb-2" data-cy="milestone-first">
              <GentleMessage kind="good">{t("trees.milestones.first")}</GentleMessage>
            </div>
          )}
          {celebrate.isAll && (
            <div data-cy="milestone-all">
              <GentleMessage kind="good">{t("trees.milestones.all")}</GentleMessage>
            </div>
          )}
        </div>
      )}
      <h1 className="text-3xl leading-[1.2] mb-4" data-cy="tree-name">
        {t(`trees.species.${tree.species}.name`)}
      </h1>
      <TreeCharacter species={tree.species} speaking={speaking} className="mx-auto mb-4 !max-w-[160px] sm:!max-w-[240px]" />
      <div className="mb-4 flex flex-col items-start gap-3">
        <TreeAudio tree={tree} onSpeakingChange={setSpeaking} />
      </div>
      <p className="text-lg leading-[1.2] mb-4" data-cy="tree-greeting">
        {t(`trees.species.${tree.species}.greeting`)}
      </p>
      <ul
        aria-label={t("trees.page.factsLabel")}
        className="list-disc pl-6 mb-6 flex flex-col gap-2 text-lg leading-[1.2]"
        data-cy="tree-facts"
      >
        {(Array.isArray(facts) ? facts : []).map((fact, i) => (
          <li key={i}>{fact}</li>
        ))}
      </ul>
      {backLink}
    </section>
  );
}
