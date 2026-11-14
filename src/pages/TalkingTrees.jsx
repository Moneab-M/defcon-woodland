/**
 * @file TalkingTrees.jsx
 * @description The Talking Trees page: a short explanation for children and a
 * list of every Talking Tree, each a link to its own page.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-54 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Router Link: https://reactrouter.com/en/main/components/link
 *
 * Notes:
 * - Needs no location and no camera. Nothing is stored.
 */

import { Link } from "react-router-dom";
import { useText } from "../i18n/useText";
import { TALKING_TREES } from "../talkingTrees/trees";
import { BUTTON_CLASSES } from "../Components/controlStyles";

/**
 * Purpose: Show the explanation and the list of Talking Trees.
 *
 * Returns: the page
 */
export default function TalkingTrees() {
  const t = useText();

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8" data-cy="trees-page">
      <h1 className="text-3xl leading-[1.2] mb-4">{t("trees.page.title")}</h1>
      <p className="text-lg leading-[1.2] mb-6">{t("trees.page.intro")}</p>

      {/* SCRUM-54: placeholder - the next ticket adds the sign scanner button here */}

      <ul aria-label={t("trees.page.listLabel")} className="flex flex-col items-start gap-3 list-none p-0">
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
