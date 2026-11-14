/**
 * @file ImageAudioButton.jsx
 * @description The Image Audio Button shown with an Image that has an Image Audio
 * Description. Activating it plays the prerecorded description; activating it again
 * during playback stops it.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-9, SCRUM-10 | SRS: [ID 103], [ID 305], [ID 307], [ID 317]
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
 * - Look comes from BUTTON_CLASSES so every control matches ([ID 317]).
 */

import { FiVolume2, FiSquare } from "react-icons/fi";
import { BUTTON_CLASSES } from "./controlStyles";
import { usePrerecordedAudio } from "../context/PrerecordedAudioContext";
import { useText } from "../i18n/useText";

/**
 * Purpose: Play or stop the Image Audio Description for one Image.
 *
 * Parameters:
 * - imageId: short id of the Image (string)
 * - src: path of the prerecorded MP3 (string)
 * - onUnavailable: optional function called if the recording cannot play
 */
export default function ImageAudioButton({ imageId, src, onUnavailable }) {
  const t = useText();
  const { playingId, unavailableId, toggle } = usePrerecordedAudio();
  const id = `image:${imageId}`;
  const playing = playingId === id;
  const unavailable = unavailableId === id;

  return (
    <>
      <button
        type="button"
        className={BUTTON_CLASSES}
        aria-pressed={playing}
        data-cy={`image-audio-button-${imageId}`}
        onClick={() => toggle(id, src, { onUnavailable })}
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
