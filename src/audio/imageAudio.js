/**
 * @file imageAudio.js
 * @description Finds the prerecorded Image Audio Description file for an Image in the
 * Selected Language.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-11 | SRS: [ID 103], [ID 305], [ID 307]
 *
 * Naming convention: public/audio/images/<imageId>_<lang>.mp3
 * - <lang> is "en" or "fr", for example about_en.mp3 and about_fr.mp3.
 * - PENDING TEAM agreement: proposed to the teammate who owns Section Text audio.
 *
 * Notes:
 * - IMAGE_AUDIO lists the languages each Image is PLANNED to have. A listed file may
 *   still be missing until it is recorded; the button then shows the unavailable notice.
 * - There is no Mi'kmaq audio, so no Mi'kmaq entry exists here.
 * - A missing language never falls back to another language or to text-to-speech.
 */

export const IMAGE_AUDIO_FOLDER = "/audio/images";

// Languages planned for each Image id
export const IMAGE_AUDIO = {
  about: ["en", "fr"],
  mission: ["en", "fr"],
  vision: ["en", "fr"],
};

/**
 * Purpose: Get the MP3 path for an Image in a language.
 *
 * Parameters:
 * - imageId: short id of the Image (string)
 * - language: Selected Language code (string)
 *
 * Returns: the path such as "/audio/images/about_en.mp3", or null if that language
 * is not listed for the Image.
 */
export function getImageAudioSrc(imageId, language) {
  const languages = Object.prototype.hasOwnProperty.call(IMAGE_AUDIO, imageId)
    ? IMAGE_AUDIO[imageId]
    : null;
  if (!languages || !languages.includes(language)) return null;
  return `${IMAGE_AUDIO_FOLDER}/${imageId}_${language}.mp3`;
}
