/**
 * @file TreePage.jsx
 * @description One Talking Tree: its name, greeting and facts in the Selected
 * Language. An unknown tree ID shows a kind message and a link back to the list.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-54 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router useParams / Link: https://reactrouter.com/en/main/hooks/use-params
 *
 * Notes:
 * - Needs no location and no camera. Nothing is stored.
 */

import { Link, useParams } from "react-router-dom";
import { useText } from "../i18n/useText";
import { getTreeById } from "../talkingTrees/trees";
import { BUTTON_CLASSES } from "../Components/controlStyles";
import TreeCharacter from "../Components/TreeCharacter";

/**
 * Purpose: Show the tree named by the :treeId part of the address.
 *
 * Returns: the page
 */
export default function TreePage() {
  const t = useText();
  const { treeId } = useParams();
  const tree = getTreeById(treeId);

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
        <p className="text-lg leading-[1.2] mb-6" data-cy="tree-unknown">{t("trees.page.unknown")}</p>
        {backLink}
      </section>
    );
  }

  const facts = t(`trees.species.${tree.species}.facts`);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8" data-cy="tree-page">
      <h1 className="text-3xl leading-[1.2] mb-4" data-cy="tree-name">
        {t(`trees.species.${tree.species}.name`)}
      </h1>
      <TreeCharacter species={tree.species} speaking={false} className="mx-auto mb-4 !max-w-[160px] sm:!max-w-[240px]" />
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
