/**
 * @file WoodlandGuide.jsx
 * @description The woodland guide: one small generic sapling with the same friendly
 * face as the Talking Tree characters. It keeps visitors company on waiting, empty,
 * error and "off the trail" screens.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-77 | SRS: [ID 318], [ID 411], [ID 316]
 *
 * NEEDS CLIENT APPROVAL before release: new illustration ([ID 318], [ID 411]); tracked in SCRUM-63.
 *
 * Notes:
 * - Purely decorative: hidden from screen readers (aria-hidden), no role, never the
 *   only carrier of a message. It adds no text.
 * - Drawing style, stroke widths, face shapes and palette match TreeCharacter.jsx.
 *   Colours: illustration palette plus currentColor for outlines. No red, green or neon.
 * - The only movement is the slow eye blink (class tree-character-eye in src/index.css),
 *   which is switched off under prefers-reduced-motion.
 * - Needs no location and no camera. Nothing is stored.
 */

// ---------- Global constants ----------
const BARK_DARK = "#6B4F3A";
const BARK = "#8A6A4F";
const GOLD = "#C9A227";
const GOLD_DEEP = "#B9772E";
const CREAM = "#EADFA8";
const OUTLINE = "currentColor";
const LINE = 2.5;
const MAX_SIZE = 96;

/**
 * Purpose: Draw the sapling: a thin trunk with the friendly face and three leaves on twigs.
 *
 * Parameters:
 * - size: height in pixels (default 72, never more than 96)
 * - className: extra classes
 */
export default function WoodlandGuide({ size = 72, className = "" }) {
  const height = Math.min(Math.max(Number(size) || 72, 16), MAX_SIZE);
  const width = Math.round((height * 200) / 240);
  const cy = 170;
  return (
    <svg
      viewBox="0 0 200 240"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`woodland-guide shrink-0 ${className}`.trim()}
      data-cy="woodland-guide"
    >
      {/* twigs */}
      <path d="M100 120 L100 70 M100 112 L62 80 M100 104 L140 66"
        fill="none" stroke={BARK} strokeWidth="4" strokeLinecap="round" />
      {/* thin trunk */}
      <path d="M80 120 C82 160 78 200 74 228 L126 228 C122 200 118 160 120 120 Z"
        fill={BARK} stroke={OUTLINE} strokeWidth={LINE} strokeLinejoin="round" />
      {/* leaves */}
      <ellipse cx="100" cy="46" rx="22" ry="32" fill={GOLD} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="52" cy="76" rx="30" ry="18" fill={GOLD_DEEP} stroke={OUTLINE} strokeWidth="2" transform="rotate(-25 52 76)" />
      <ellipse cx="148" cy="62" rx="30" ry="18" fill={GOLD} stroke={OUTLINE} strokeWidth="2" transform="rotate(25 148 62)" />
      {/* face, same shapes as TreeCharacter */}
      <g data-cy="woodland-guide-face">
        <ellipse cx="100" cy={cy} rx="17" ry="15" fill={CREAM} stroke={BARK_DARK} strokeWidth="1.5" />
        <ellipse className="tree-character-eye" cx="93" cy={cy - 4} rx="2.8" ry="3.4" fill={BARK_DARK} />
        <ellipse className="tree-character-eye" cx="107" cy={cy - 4} rx="2.8" ry="3.4" fill={BARK_DARK} />
        <path d={`M92 ${cy + 3} Q100 ${cy + 11} 108 ${cy + 3}`}
          fill="none" stroke={BARK_DARK} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
