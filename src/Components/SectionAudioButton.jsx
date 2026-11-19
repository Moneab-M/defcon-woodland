
import { useEffect, useRef } from "react";
import { usePrerecordedAudio } from "../context/PrerecordedAudioContext";
import { useLanguage } from "../context/LanguageContext";
import { useText } from "../i18n/useText";
import { FaVolumeUp, FaPause } from "react-icons/fa";
import { getSectionAudioSrc } from "../audio/sectionAudio";

/**
 * SCRUM-27: Reusable prerecorded Section Audio button.
 *
 * audioId identifies a unique text section.
 * src is the URL of its approved MP3 recording.
 */
export default function SectionAudioButton({
  audioId, src, pageId, sectionId, sectionTitle,
  playLabelKey = "common.sectionAudio.play",
  stopLabelKey = "common.sectionAudio.stop",
}) {
  const t = useText();
  const { language } = useLanguage();

  const { playingId, unavailableId, toggle, stop } =
    usePrerecordedAudio();

  const isPlaying = playingId === audioId;
  const isUnavailable = unavailableId === audioId;
  // An explicit src overrides lookup; otherwise resolve by page, section and language.
  const file = src ?? getSectionAudioSrc(pageId, sectionId, language);

  const previousLanguage = useRef(language);
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  // Stop the current recording if the visitor changes language.
  useEffect(() => {
    if (previousLanguage.current !== language) {
      previousLanguage.current = language;

      if (playingRef.current) {
        stop();
      }
    }
  }, [language, stop]);

  const handleClick = () => {
    toggle(audioId, file);
  };

  return (
    <div>
      <button
        type="button"
        className={
          "inline-flex items-center justify-center w-11 h-11 rounded-full " +
          "text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white " +
          "hover:bg-blue-100 dark:hover:bg-blue-950/60 shadow-md transition " +
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/70"
        }
        aria-label={`${isPlaying ? t(stopLabelKey) : t(playLabelKey)}${sectionTitle ? `: ${sectionTitle}` : ""}`}
        title={isPlaying ? t(stopLabelKey) : t(playLabelKey)}
        aria-pressed={isPlaying}
        data-cy={`section-audio-${pageId}-${sectionId}`}
        onClick={handleClick}
      >
        {isPlaying ? (
          <FaPause className="text-xl" aria-hidden="true" />
        ) : (
          <FaVolumeUp className="text-xl" aria-hidden="true" />
        )}
      </button>

      {isUnavailable && (
        <p role="status">
          {t("common.sectionAudio.unavailable")}
        </p>
      )}
    </div>
  );
}
