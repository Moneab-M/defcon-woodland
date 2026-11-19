/**
 * @file TreeCharacter.jsx
 * @description A friendly drawn tree character for each Talking Tree species
 * (yellow birch, red spruce, red maple, white pine). Each has a small smiling
 * face on its trunk. When "speaking" the crown sways slowly and the mouth opens
 * and closes gently. The eyes blink every few seconds.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-56, SCRUM-78 | SRS: [ID 318], [ID 411], [ID 316]
 *
 * NEEDS CLIENT APPROVAL before release: new illustrations ([ID 318], [ID 411]); tracked in SCRUM-63.
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React: https://react.dev
 *
 * Notes:
 * - Species are told apart by SHAPE: birch = oval crown of small round leaves and
 *   pale peeling trunk; spruce = narrow cone of drooping jagged tiers; maple =
 *   broad crown with a lobed, pointed outline; white pine = tall straight trunk
 *   with flat horizontal tiers and long needle tufts.
 * - Colours come only from the illustration palette below, plus currentColor for
 *   outlines (black in Light Mode, pale yellow in Dark Mode). No green, red or neon.
 * - The face sits on a small pale cream patch with dark brown features, so it is
 *   readable on every trunk in both Light and Dark Mode (currentColor would be
 *   pale on pale in Dark Mode).
 * - Animation lives in src/index.css (classes starting tree-character-) and is
 *   switched off under prefers-reduced-motion.
 * - Needs no location and no camera. Nothing is stored.
 *
 * Palette (HSV: hue deg / saturation % / value %). Forbidden: Red = hue 345-15 with
 * saturation >= 30; Green = hue 75-165 with saturation >= 30; Neon = saturation >= 90
 * and value >= 90.
 *   #6B4F3A bark          26 / 46 / 42  hue outside red and green; not neon
 *   #8A6A4F bark          27 / 43 / 54  hue outside red and green; not neon
 *   #E8DCC8 birch bark    38 / 14 / 91  hue outside red and green; saturation low
 *   #C9B79C birch bark    36 / 22 / 79  hue outside red and green; saturation low
 *   #C9A227 golden foliage 46 / 81 / 79 hue outside red and green; value under 90
 *   #B9772E golden foliage 32 / 75 / 73 hue outside red and green; value under 90
 *   #5F7A8A spruce blue-grey 202 / 31 / 54  hue outside red and green; not neon
 *   #3E5566 spruce blue-grey 206 / 39 / 40  hue outside red and green; not neon
 *   #EADFA8 pale cream    50 / 28 / 92  hue outside red and green; saturation under 90
 */

import React from "react";
import { useText } from "../i18n/useText";

// ---------- Global constants ----------
const SPECIES = ["yellowBirch", "redSpruce", "redMaple", "whitePine"];
const BARK_DARK = "#6B4F3A";
const BARK = "#8A6A4F";
const BIRCH_PALE = "#E8DCC8";
const BIRCH_SHADE = "#C9B79C";
const GOLD = "#C9A227";
const GOLD_DEEP = "#B9772E";
const SPRUCE = "#5F7A8A";
const SPRUCE_DEEP = "#3E5566";
const CREAM = "#EADFA8";
const OUTLINE = "currentColor";
const LINE = 2.5;
// SCRUM-78: where the small knot-hole sits on each trunk (drawing units, viewBox 200 x 240)
export const KNOT_POSITIONS = {
  yellowBirch: [90, 218],
  redSpruce: [100, 225],
  redMaple: [80, 216],
  whitePine: [100, 225],
};
// Black, white and grey-cream for the chickadee (low saturation, so not Red, Green or Neon)
const CHICKADEE_BLACK = "#000000";
const CHICKADEE_WHITE = "#FFFFFF";
const CHICKADEE_BODY = "#D9D4C7";

/** Purpose: Round to one decimal so the drawing stays small and stable. */
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * Purpose: Small face (two eyes and a smile) on a pale patch, centred on the trunk.
 *
 * Parameters:
 * - cy: vertical centre of the patch
 */
function Face({ cy }) {
  return (
    <g data-cy="tree-character-face">
      <ellipse cx="100" cy={cy} rx="17" ry="15" fill={CREAM} stroke={BARK_DARK} strokeWidth="1.5" />
      <ellipse className="tree-character-eye" cx="93" cy={cy - 4} rx="2.8" ry="3.4" fill={BARK_DARK} />
      <ellipse className="tree-character-eye" cx="107" cy={cy - 4} rx="2.8" ry="3.4" fill={BARK_DARK} />
      <path
        className="tree-character-mouth"
        d={`M92 ${cy + 3} Q100 ${cy + 11} 108 ${cy + 3}`}
        fill="none"
        stroke={BARK_DARK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Purpose: Yellow birch: oval crown of small round leaves, pale peeling trunk. */
function YellowBirch() {
  const leaves = [];
  for (let i = 0; i < 24; i++) {
    const a = (i * 15 * Math.PI) / 180;
    leaves.push(
      <circle key={i} cx={r1(100 + 55 * Math.cos(a))} cy={r1(85 + 64 * Math.sin(a))} r="11"
        fill={GOLD} stroke={OUTLINE} strokeWidth="2" />
    );
  }
  const dots = [[80, 60], [115, 55], [95, 85], [125, 90], [70, 100], [105, 115], [85, 125], [120, 120], [100, 38]];
  return (
    <>
      <path d="M80 148 C82 180 78 205 76 228 L124 228 C122 205 118 180 120 148 Z"
        fill={BIRCH_PALE} stroke={OUTLINE} strokeWidth={LINE} strokeLinejoin="round" />
      {/* thin curly peeling strips and short horizontal bark lines */}
      <path d="M80 166 c-10 1 -12 9 -5 11 c5 1 7 -4 3 -6" fill="none" stroke={BARK} strokeWidth="2" strokeLinecap="round" />
      <path d="M120 176 c10 1 12 9 5 11 c-5 1 -7 -4 -3 -6" fill="none" stroke={BARK} strokeWidth="2" strokeLinecap="round" />
      <path d="M78 214 c-9 1 -11 8 -4 10 c5 1 6 -4 3 -5" fill="none" stroke={BARK} strokeWidth="2" strokeLinecap="round" />
      <path d="M82 158 h9 M110 160 h8 M84 226 h10 M108 214 h10 M81 190 h4 M115 200 h4"
        fill="none" stroke={BARK} strokeWidth="2" strokeLinecap="round" />
      <g className="tree-character-crown" data-cy="tree-character-crown">
        <ellipse cx="100" cy="85" rx="55" ry="64" fill={GOLD} />
        {leaves}
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={GOLD_DEEP} />)}
      </g>
      <Face cy={188} />
    </>
  );
}

/**
 * Purpose: Build one spruce tier: a drooping triangle with a jagged (needle) lower edge.
 *
 * Parameters:
 * - top, bottom: vertical extent; half: half the width at the bottom
 */
function spruceTier(top, bottom, half) {
  const teeth = 7;
  const step = (half * 2) / teeth;
  let d = `M100 ${top} Q${100 - half * 0.45} ${top + (bottom - top) * 0.6} ${100 - half} ${bottom + 4}`;
  for (let i = 0; i < teeth; i++) {
    const x = 100 - half + step * i;
    d += ` L${r1(x + step / 2)} ${bottom - 5} L${r1(x + step)} ${bottom + (i === teeth - 1 ? 4 : 2)}`;
  }
  d += ` Q${100 + half * 0.45} ${top + (bottom - top) * 0.6} 100 ${top} Z`;
  return d;
}

/** Purpose: Red spruce: narrow cone of layered, drooping, jagged tiers. */
function RedSpruce() {
  const tiers = [
    [120, 182, 64, SPRUCE_DEEP],
    [84, 146, 52, SPRUCE],
    [48, 108, 40, SPRUCE_DEEP],
    [12, 70, 28, SPRUCE],
  ];
  return (
    <>
      <path d="M80 180 L80 228 L120 228 L120 180 Z" fill={BARK_DARK} stroke={OUTLINE} strokeWidth={LINE} strokeLinejoin="round" />
      <g className="tree-character-crown" data-cy="tree-character-crown">
        {tiers.map(([top, bottom, half, fill], i) => (
          <path key={i} d={spruceTier(top, bottom, half)} fill={fill} stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        ))}
      </g>
      <Face cy={206} />
    </>
  );
}

/**
 * Purpose: Points of a lobed, pointed maple-leaf crown outline around a centre.
 *
 * Parameters:
 * - scale: 1 for the outline, smaller for the inner highlight
 */
function mapleCrown(scale) {
  const lobes = 9;
  const step = (Math.PI * 2) / lobes;
  const pts = [];
  for (let k = 0; k < lobes; k++) {
    const a = k * step - Math.PI / 2;
    [[-0.5, 0.78], [-0.3, 0.93], [-0.17, 0.85], [0, 1], [0.17, 0.85], [0.3, 0.93]].forEach(([da, rad]) => {
      const ang = a + da * step;
      pts.push(`${r1(100 + 80 * rad * scale * Math.cos(ang))},${r1(82 + 66 * rad * scale * Math.sin(ang))}`);
    });
  }
  return pts.join(" ");
}

/** Purpose: Red maple: broad round crown with a lobed, pointed outline, sturdy trunk. */
function RedMaple() {
  return (
    <>
      <path d="M84 138 C86 176 80 204 68 228 L132 228 C120 204 114 176 116 138 Z"
        fill={BARK} stroke={OUTLINE} strokeWidth={LINE} strokeLinejoin="round" />
      <g className="tree-character-crown" data-cy="tree-character-crown">
        <polygon points={mapleCrown(1)} fill={GOLD_DEEP} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="miter" />
        <polygon points={mapleCrown(0.62)} fill={GOLD} stroke={GOLD_DEEP} strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M100 82 L100 40 M100 82 L62 62 M100 82 L138 62 M100 82 L56 100 M100 82 L144 100"
          fill="none" stroke={BARK_DARK} strokeWidth="2" strokeLinecap="round" />
      </g>
      <Face cy={190} />
    </>
  );
}

/** Purpose: White pine: tall straight trunk, flat horizontal tiers, long needle tufts. */
function WhitePine() {
  const plates = [[30, 24], [62, 36], [94, 48], [126, 60], [158, 72]];
  return (
    <>
      <path d="M86 24 L82 228 L118 228 L114 24 Z" fill={BARK} stroke={OUTLINE} strokeWidth={LINE} strokeLinejoin="round" />
      <g className="tree-character-crown" data-cy="tree-character-crown">
        {plates.map(([y, rx], i) => {
          const tufts = [];
          for (let j = -3; j <= 3; j++) {
            const x = 100 + (j * rx) / 3.3;
            tufts.push(`M${r1(x)} ${y + 6} l${r1(j * 2.5)} 16`);
          }
          return (
            <g key={i}>
              <path d={tufts.join(" ")} fill="none" stroke={OUTLINE} strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="100" cy={y} rx={rx} ry="10" fill={i % 2 ? SPRUCE_DEEP : SPRUCE} stroke={OUTLINE} strokeWidth="2" />
            </g>
          );
        })}
      </g>
      <Face cy={204} />
    </>
  );
}

/**
 * Purpose: A small dark oval knot-hole on the trunk, and (when open) a black-capped
 * chickadee peeking out of it (SCRUM-78). Decorative only: the real button is in TreeKnotHole.
 *
 * Parameters:
 * - species: picks the position on the trunk
 * - open: true to show the bird
 */
function KnotHole({ species, open }) {
  const [kx, ky] = KNOT_POSITIONS[species];
  return (
    <g data-cy="tree-knot-drawing">
      <ellipse cx={kx} cy={ky} rx="6" ry="4.5" fill={SPRUCE_DEEP} stroke={OUTLINE} strokeWidth="1.2" />
      {open && (
        <g className="tree-egg-bird" data-cy="tree-egg-bird">
          <ellipse cx={kx} cy={ky - 4} rx="9" ry="8" fill={CHICKADEE_BODY} stroke={OUTLINE} strokeWidth="1" />
          <path d={`M${kx - 8} ${ky - 6} A8 8 0 0 1 ${kx + 8} ${ky - 6} Z`} fill={CHICKADEE_BLACK} />
          <ellipse cx={kx} cy={ky - 2} rx="6.5" ry="3.5" fill={CHICKADEE_WHITE} />
          <circle cx={kx - 3} cy={ky - 4} r="1.3" fill={CHICKADEE_BLACK} />
          <path d={`M${kx - 6} ${ky - 3} l-4 1.5 l4 1 Z`} fill={CHICKADEE_BLACK} />
        </g>
      )}
    </g>
  );
}

const DRAWINGS = { yellowBirch: YellowBirch, redSpruce: RedSpruce, redMaple: RedMaple, whitePine: WhitePine };

/**
 * Purpose: Draw the character for one species.
 *
 * Parameters:
 * - species: yellowBirch, redSpruce, redMaple or whitePine (anything else draws nothing)
 * - speaking: true while the tree talks (crown sways, mouth moves)
 * - className: extra classes for sizing
 * - knotOpen: undefined draws no knot-hole; false draws it closed; true shows the bird (SCRUM-78)
 *
 * Returns: an inline svg, or null for an unknown species
 */
export default function TreeCharacter({ species, speaking = false, className = "", knotOpen }) {
  const t = useText();
  if (!SPECIES.includes(species)) return null;
  const Drawing = DRAWINGS[species];
  const name = t(`trees.species.${species}.name`).toLowerCase();
  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label={t("trees.character.alt", { name })}
      focusable="false"
      className={`tree-character-svg w-full h-auto max-w-[240px] ${speaking ? "tree-character-speaking" : ""} ${className}`.trim()}
      data-cy={`tree-character-${species}`}
    >
      <g aria-hidden="true">
        <Drawing />
        {knotOpen !== undefined && <KnotHole species={species} open={knotOpen} />}
      </g>
    </svg>
  );
}
