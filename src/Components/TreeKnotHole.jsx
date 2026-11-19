/**
 * @file TreeKnotHole.jsx
 * @description The tree character with a small hidden knot-hole on its trunk. A real
 * button sits over the knot-hole; pressing it shows or hides a chickadee peeking out
 * and one short line of text, announced politely. No sound is played.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-78 | SRS: Talking Tree, [ID 316], [ID 317]
 *
 * NEEDS VERIFICATION: black-capped chickadee chosen as a bird found in the
 * St. Margaret's Bay woods; confirm with the client.
 *
 * Notes:
 * - The button cannot live inside the svg, so it is placed over it in a relative wrapper.
 *   Its hit area is 44 x 44 px; only the small knot-hole is drawn.
 * - The line sits below the character, so it never covers the audio button, facts or transcript.
 * - Nothing is stored. Motion is in src/index.css (tree-egg-) and off for reduced motion.
 */

import { useState } from "react";
import { useText } from "../i18n/useText";
import TreeCharacter, { KNOT_POSITIONS } from "./TreeCharacter";

/**
 * Purpose: Draw the tree character with its knot-hole button and the line of text.
 *
 * Parameters:
 * - species: yellowBirch, redSpruce, redMaple or whitePine
 * - speaking: passed to the character
 * - className: sizing classes for the wrapper
 */
export default function TreeKnotHole({ species, speaking = false, className = "" }) {
  const t = useText();
  const [open, setOpen] = useState(false);
  const pos = KNOT_POSITIONS[species];
  if (!pos) return <TreeCharacter species={species} speaking={speaking} className={className} />;
  return (
    <div>
      <div className={`relative w-full max-w-[240px] ${className}`.trim()} data-cy="tree-knot-wrapper">
        <TreeCharacter species={species} speaking={speaking} knotOpen={open} className="!max-w-none !mx-0 !mb-0" />
        <button
          type="button"
          aria-expanded={open}
          aria-label={t("trees.easterEgg.button")}
          onClick={() => setOpen((v) => !v)}
          className="absolute min-h-[44px] min-w-[44px] w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent"
          style={{ left: `${(pos[0] / 200) * 100}%`, top: `${(pos[1] / 240) * 100}%` }}
          data-cy="tree-knot-hole"
        />
      </div>
      <p role="status" className="text-lg leading-[1.2] text-center mt-2" data-cy="knot-hole-line">
        {open ? t("trees.easterEgg.line") : ""}
      </p>
    </div>
  );
}
