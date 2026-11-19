/**
 * @file ForestWaiting.jsx
 * @description A calm "the forest is listening" waiting block: three small
 * leaf shapes that pulse one after another, and one short line of text.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-73 | SRS: Talking Tree, Site Map
 *
 * Notes:
 * - Announced politely once. It never takes focus, has no countdown and no time limit.
 * - The shapes are decorative (aria-hidden). Under reduced motion they stay still (src/index.css).
 * - Shape colours come from the illustration palette; the text colour is inherited.
 */

import WoodlandGuide from "./WoodlandGuide";

const LEAF_COLOURS = ["#C9A227", "#B9772E", "#5F7A8A"];

/**
 * Purpose: Show a waiting message with a gentle, slow picture.
 * Parameters: message (string, already translated), className (optional extra classes).
 */
export default function ForestWaiting({ message, className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-cy="forest-waiting"
      className={("flex items-center justify-center gap-3 " + className).trim()}
    >
      <WoodlandGuide size={48} />
      <span aria-hidden="true" className="inline-flex items-center gap-1" data-cy="forest-waiting-shapes">
        {LEAF_COLOURS.map((colour, i) => (
          <svg
            key={colour}
            viewBox="0 0 20 20"
            width="20"
            height="20"
            className={"forest-waiting-leaf forest-waiting-leaf-" + (i + 1)}
            focusable="false"
          >
            <path d="M10 2 C16 6 16 14 10 18 C4 14 4 6 10 2 Z" fill={colour} />
          </svg>
        ))}
      </span>
      <span className="text-lg leading-[1.2]">{message}</span>
    </div>
  );
}
