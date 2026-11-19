/**
 * @file treeAudio.js
 * @description Finds the prerecorded audio (and optional caption timings) for a
 * Talking Tree in the Selected Language.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-57 | SRS: Talking Tree, [ID 103], [ID 307]
 *
 * Naming convention: public/audio/trees/<tree ID>_<lang>.mp3
 * - <lang> is "en" or "fr", for example yellow-birch-1_en.mp3.
 * - The text to record is in docs/talking-trees/recording-script.md.
 *
 * How to switch a file to recorded:
 * 1. Put the MP3 in public/audio/trees/ with the name above and delete its
 *    <name>.mp3.PLACEHOLDER.txt marker.
 * 2. In TREE_AUDIO below, change that tree and language to `recorded: true`.
 * 3. Optional captions: set `cues` to a list of { start, end, line } in seconds, where
 *    line 0 is the greeting and lines 1, 2, ... are the facts in order. With
 *    `cues: null` the whole text is shown while the recording plays.
 *
 * Notes:
 * - There is no Mi'kmaq audio, so no Mi'kmaq entry exists here and none may be added.
 * - A missing language never falls back to another language or to text-to-speech.
 */

export const TREE_AUDIO_FOLDER = "/audio/trees";

// Recording status for each tree and language. No recordings exist yet.
export const TREE_AUDIO = {
  "yellow-birch-1": {
    en: { recorded: false, cues: null },
    fr: { recorded: false, cues: null },
  },
  "red-spruce-1": {
    en: { recorded: false, cues: null },
    fr: { recorded: false, cues: null },
  },
  "red-maple-1": {
    en: { recorded: false, cues: null },
    fr: { recorded: false, cues: null },
  },
  "white-pine-1": {
    en: { recorded: false, cues: null },
    fr: { recorded: false, cues: null },
  },
};

/**
 * Purpose: Get the recording for a tree in a language.
 *
 * Parameters:
 * - treeId: the tree's ID (string), for example "yellow-birch-1"
 * - language: Selected Language code (string)
 *
 * Returns: { src, cues } when that language is recorded, otherwise null.
 */
export function getTreeAudio(treeId, language) {
  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  if (!has(TREE_AUDIO, treeId)) return null;
  const languages = TREE_AUDIO[treeId];
  if (!has(languages, language)) return null;
  const entry = languages[language];
  if (!entry || entry.recorded !== true) return null;
  return { src: `${TREE_AUDIO_FOLDER}/${treeId}_${language}.mp3`, cues: entry.cues || null };
}
