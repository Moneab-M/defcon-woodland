/**
 * @file ImageAudioButton.jsx
 * @description The Image Audio Button shown with an Image that has an Image Audio
 * Description. Activating it plays the prerecorded description; activating it again
 * during playback stops it.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-9, SCRUM-10, SCRUM-11 | SRS: [ID 103], [ID 305], [ID 307], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Icons: https://react-icons.github.io/react-icons/
 *
 * Notes:
 * - Show exactly one of these per Image that has an Image Audio Description.
 * - Playback goes through the shared player in PrerecordedAudioContext, so starting
 *   one recording stops any other.
 * - If the recording is missing or fails, a short notice replaces any sound (no
 *   text-to-speech); it stays until the visitor activates a button again.
 * - The file comes from the Selected Language (see src/audio/imageAudio.js). With no
 *   file for that language (Mi'kmaq has none) the notice shows and nothing plays.
 *   Changing the language stops a description that is playing.
 * - Look comes from BUTTON_CLASSES so every control matches ([ID 317]).
 */

import { useEffect, useRef } from "react";
import { FiVolume2, FiSquare } from "react-icons/fi";
import { BUTTON_CLASSES } from "./controlStyles";
import { usePrerecordedAudio } from "../context/PrerecordedAudioContext";
import { useLanguage } from "../context/LanguageContext";
import { getImageAudioSrc } from "../audio/imageAudio";
import { useText } from "../i18n/useText";

/**
 * Purpose: Play or stop the Image Audio Description for one Image.
 *
 * Parameters:
 * - imageId: short id of the Image (string)
 * - src: optional path overriding the language lookup (string)
 * - onUnavailable: optional function called if the recording cannot play
 */
export default function ImageAudioButton({ imageId, src, onUnavailable }) {
  const t = useText();
  const { language } = useLanguage();
  const { playingId, unavailableId, toggle, stop } = usePrerecordedAudio();
  const id = `image:${imageId}`;
  const playing = playingId === id;
  const unavailable = unavailableId === id;
  const file = src || getImageAudioSrc(imageId, language);

  // Stop this description when the Selected Language changes
  const previousLanguage = useRef(language);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  useEffect(() => {
    if (previousLanguage.current !== language) {
      previousLanguage.current = language;
      if (playingRef.current) stop();
    }
  }, [language, stop]);

  // Play the file, or just show the notice when there is none for this language
  const handleClick = () => {
    toggle(id, file, { onUnavailable });
  };

  return (
    <>
      <button
        type="button"
        className={BUTTON_CLASSES}
        aria-pressed={playing}
        data-cy={`image-audio-button-${imageId}`}
        onClick={handleClick}
      >
        {playing ? <FiSquare aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
        {playing ? t("common.imageAudio.stop") : t("common.imageAudio.play")}
      </button>
      {unavailable && (
        <p role="status" className="text-lg leading-[1.2]" data-cy={`image-audio-unavailable-${imageId}`}>
          {t("common.imageAudio.unavailable")}
        </p>
      )}
    </>
  );
}
