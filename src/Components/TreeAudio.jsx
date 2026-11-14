/**
 * @file TreeAudio.jsx
 * @description Plays a Talking Tree's prerecorded audio, with captions while it plays
 * and a full transcript that is always available.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-57 | SRS: Talking Tree, [ID 103], [ID 307], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Icons: https://react-icons.github.io/react-icons/
 *
 * Notes:
 * - Prerecorded MP3 only, through the shared player. Never text-to-speech and never
 *   another language's recording. Nothing plays until the visitor taps the button.
 * - With no recording for the Selected Language a gentle notice shows and nothing
 *   plays; the transcript stays readable. Changing the language stops playback.
 * - The line being spoken is marked with aria-current and an underline (not colour).
 */

import { useEffect, useRef } from "react";
import { FiVolume2, FiSquare } from "react-icons/fi";
import { BUTTON_CLASSES } from "./controlStyles";
import { usePrerecordedAudio } from "../context/PrerecordedAudioContext";
import { useLanguage } from "../context/LanguageContext";
import { getTreeAudio } from "../talkingTrees/treeAudio";
import { useText } from "../i18n/useText";

/**
 * Purpose: Play or stop one tree's recording and show its captions and transcript.
 *
 * Parameters:
 * - tree: an entry from TALKING_TREES ({ id, species, ... })
 * - audioOverride: optional { src, cues } used instead of the manifest (for tests)
 * - onSpeakingChange: optional function called with true/false as playback starts/ends
 */
export default function TreeAudio({ tree, audioOverride, onSpeakingChange }) {
  const t = useText();
  const { language } = useLanguage();
  const { playingId, unavailableId, currentTime, toggle, stop } = usePrerecordedAudio();
  const id = `tree:${tree.id}`;
  const playing = playingId === id;
  const audio = audioOverride || getTreeAudio(tree.id, language);
  const showNotice = !audio || unavailableId === id;

  // Greeting then facts, in the Selected Language (line 0 is the greeting)
  const facts = t(`trees.species.${tree.species}.facts`);
  const lines = [t(`trees.species.${tree.species}.greeting`), ...(Array.isArray(facts) ? facts : [])];

  // Tell the page whether this tree is speaking
  useEffect(() => {
    if (onSpeakingChange) onSpeakingChange(playing);
  }, [playing, onSpeakingChange]);

  // Stop this recording when the Selected Language changes, or when leaving the page
  const previousLanguage = useRef(language);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  useEffect(() => {
    if (previousLanguage.current !== language) {
      previousLanguage.current = language;
      if (playingRef.current) stop();
    }
  }, [language, stop]);
  useEffect(() => () => { if (playingRef.current) stop(); }, [stop]);

  // Play or stop; with no recording only the notice shows (nothing plays)
  const handleClick = () => {
    toggle(id, audio ? audio.src : null);
  };

  // Which line is being spoken now (index into lines), or -1
  const cues = audio && Array.isArray(audio.cues) ? audio.cues : null;
  const currentCue = playing && cues ? cues.find((c) => currentTime >= c.start && currentTime < c.end) : null;
  const currentLine = currentCue ? currentCue.line : -1;

  return (
    <div className="w-full flex flex-col items-start gap-3" data-cy="tree-audio">
      <button
        type="button"
        className={BUTTON_CLASSES}
        aria-pressed={playing}
        data-cy="tree-audio-button"
        onClick={handleClick}
      >
        {playing ? <FiSquare aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
        {playing ? t("trees.audio.stop") : t("trees.audio.play")}
      </button>
      {showNotice && (
        <p role="status" className="text-lg leading-[1.2]" data-cy="tree-audio-unavailable">
          {t("trees.audio.unavailable")}
        </p>
      )}
      {playing && (
        <div aria-label={t("trees.audio.captionsLabel")} className="text-lg leading-[1.2]" data-cy="tree-captions">
          {cues
            ? currentLine >= 0 && lines[currentLine] !== undefined && (
                <p aria-current="true" className="underline underline-offset-4" data-cy="tree-caption-line">
                  {lines[currentLine]}
                </p>
              )
            : lines.map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
        </div>
      )}
      <details className="w-full" data-cy="tree-transcript">
        <summary className="cursor-pointer min-h-[44px] flex items-center text-lg leading-[1.2]">
          {t("trees.audio.transcript")}
        </summary>
        <div className="text-lg leading-[1.2] flex flex-col gap-2 pt-2">
          {lines.map((line, i) => (
            <p key={i} data-cy="tree-transcript-line">{line}</p>
          ))}
        </div>
      </details>
    </div>
  );
}
