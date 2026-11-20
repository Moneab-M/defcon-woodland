/**
 * SCRUM-27 / SCRUM-29: Proposed language-aware Section Audio path lookup.
 *
 * Proposed naming: public/audio/sections/<pageId>_<sectionId>_<language>.mp3
 * Mirrors the existing image-audio lookup structure. Confirm final filenames
 * with Moneab and the team before merging or adding approved recordings.
 *
 * Only English and French are mapped. No Mi'kmaq recording or language
 * fallback is implied until language content and audio are verified.
 */
export const SECTION_AUDIO_FOLDER = "/audio/sections";

const SECTION_IDS = {
  about: ["about", "mission", "vision"],
  home: ["full", "hero", "conservation", "sustainable", "wildlife"],

  ecosystem: [
    "intro", "heron", "deer", "coyote", "birch",
    "wetlands", "artifacts", "flora", "fauna", "fungi",
  ],

  naturalburial: [
    "description", "types", "markers", "locations", "modal_types", "modal_markers", "modal_locations",
  ],
};

const AUDIO_LANGUAGES = ["en", "fr"];

export function getSectionAudioSrc(pageId, sectionId, language) {
  if (!SECTION_IDS[pageId]?.includes(sectionId)) return null;
  if (!AUDIO_LANGUAGES.includes(language)) return null;
  return `${SECTION_AUDIO_FOLDER}/${pageId}_${sectionId}_${language}.mp3`;
}
