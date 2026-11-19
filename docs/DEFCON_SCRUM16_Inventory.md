# SCRUM-16 — Text-Content Section and Audio Inventory

**Project:** DEFCON — Woodland Conservation Area Website  
**Course:** CSCI 3428 — Software Engineering (Fall 2026)  
**Prepared by:** Sharwen Ahmed  
**Inventory date:** November 4, 2026  
**Jira:** https://defcon1.atlassian.net/browse/SCRUM-16  
**Source:** Terminal inspection of current `src/pages/*.jsx` files on branch `feature/SCRUM-16-map-text-content-sections`

## Purpose and SRS traceability

Document which existing text areas have audio controls and identify possible new Section Audio locations **before implementing or replacing any audio code**. The SRS defines a **Text-Content Section** as a block of written website text with its own Audio Control; **[ID 102]** requires activating a section's control to play its associated prerecorded Section Audio Recording, and **[ID 202]** requires playback to begin within 1.0 second if the recording is available.

This is an **inventory of the inspected page source**, not proof that all required prerecorded recordings are available. Confirm ownership and final coverage with the current team SRS and other developers before implementing SCRUM-17.

## A. Existing section-text / card-text speech controls

**Current behaviour:** The controls below use `window.speechSynthesis` / `SpeechSynthesisUtterance` (browser-generated TTS), **not confirmed prerecorded section MP3 playback**.

| ID | Page | Text section or content | Source file | Existing audio behaviour | Tentative classification |
|---|---|---|---|---|---|
| A-01 | About | About Us (`about`) | `src/pages/About.jsx` | `handleRead(sec.id, sec.text)` -> browser TTS | Section Audio candidate — Sharwen |
| A-02 | About | Mission (`mission`) | `src/pages/About.jsx` | `handleRead` -> browser TTS | Section Audio candidate — Sharwen |
| A-03 | About | Vision (`vision`) | `src/pages/About.jsx` | `handleRead` -> browser TTS | Section Audio candidate — Sharwen |
| H-01 | Home | Welcome / hero introduction | `src/pages/Home.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| H-02 | Home | Conservation Projects | `src/pages/Home.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| H-03 | Home | Sustainable Practices | `src/pages/Home.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| H-04 | Home | Wildlife Protection | `src/pages/Home.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| E-01 | Ecosystem | Ecosystem introduction | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| E-02 | Ecosystem | Heron flip-card text | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Image/card text — resolve with Moneab |
| E-03 | Ecosystem | Deer flip-card text | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Image/card text — resolve with Moneab |
| E-04 | Ecosystem | Coyote flip-card text | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Image/card text — resolve with Moneab |
| E-05 | Ecosystem | Key Features: Yellow Birch Trees | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate; button positioned by list intro |
| E-06 | Ecosystem | Flora | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| E-07 | Ecosystem | Fauna | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| E-08 | Ecosystem | Fungi | `src/pages/Ecosystem.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| N-01 | Natural Burial | Description of Natural Burial | `src/pages/NaturalBurial.jsx` | `handleSpeakText` -> browser TTS | Section Audio candidate — Sharwen |
| N-02 | Natural Burial | Types of Burial card | `src/pages/NaturalBurial.jsx` | `handleSpeakText` -> browser TTS | Text/image card — confirm division with Moneab |
| N-03 | Natural Burial | Burial Markers card | `src/pages/NaturalBurial.jsx` | `handleSpeakText` -> browser TTS | Text/image card — confirm division with Moneab |
| N-04 | Natural Burial | Burial Locations card | `src/pages/NaturalBurial.jsx` | `handleSpeakText` -> browser TTS | Text/image card — confirm division with Moneab |

**Count in these page files:** 19 existing TTS controls (3 About + 4 Home + 8 Ecosystem + 4 Natural Burial). This is **not** the final number of assigned Section Audio recordings: some controls narrate image-linked content.

## B. Other readable content without a confirmed text-audio control

| Page | Additional content | Current result | Follow-up |
|---|---|---|---|
| About | Impact Stats: 3 statistics | No individual TTS button in inspected markup | Decide if stats require audio; verify SRS |
| About | Species Spotlight: 4 species with notes | No individual TTS buttons seen | Decide whether each note is a Text-Content Section |
| About | Woodland Timeline: 3 events | No individual TTS buttons seen | Confirm scope |
| About | Questions & Answers: 4 accordion items | No individual TTS buttons seen | Confirm scope; FAQ currently describes obsolete browser TTS |
| Home | Three Relevant Articles summaries | No audio buttons shown | Decide if article summaries require audio |
| Home | Featured Species: Yellow Birch short description and modal | No audio button shown | Confirm whether popup text is included |
| Home | Weather Widget | Dynamic weather/location data | Likely different treatment; confirm with SRS |
| Gallery | Add Your Own Image, Uploaded Images, upload status | No text-audio controls found | Primarily UI/gallery; confirm scope; coordinate image descriptions with Moneab |
| Contact | Contact & Inquiry Form, Personal Information, Inquiry Details, validation messages | No text-audio controls found | Primarily form UI; confirm scope |
| Ecosystem | Key Features list: Wetlands; Historical Artifacts | No corresponding audio controls shown | These list items might need their own Section Audio; confirm |
| Natural Burial | Types, Markers, Locations popup descriptions | No separate modal audio controls shown | Existing button narration is *different* from the short card summary and longer modal descriptions; confirm intended recording text |

## C. Related audio — ownership boundaries

### About: image audio (Moneab)

`About.jsx` defines three **image-description** MP3 paths: `/audio/about-desc.mp3`, `/audio/mission-desc.mp3`, and `/audio/vision-desc.mp3`. `playImageAudio(sec)` uses `new Audio(sec.audioDescSrc)` but falls back to browser TTS if playback fails. **MP3 file existence has not been verified.** The page also references `/audio/forest-ambient.mp3` for looping ambient sound; this is not Section Audio.

### Ecosystem: image/card text (confirm with Moneab)

Heron, Deer and Coyote flip-card controls narrate text about images. Determine with Moneab whether they are image-description controls or independently defined Text-Content Sections; avoid duplicate implementations.

### Talking Trees / MapView (Tapiwa)

`src/pages/MapView.jsx` has **one location-dependent** `handlePlayAudio()` button, using `SpeechSynthesisUtterance(nearestPoi.poi.tts)` to narrate whichever supported POI is nearest. The `TALKING_TREE_POIS` data currently contains **five** narrated POIs: Trailhead, Farmhouse Foundation, Well, Sitting Area, and Coastal Yellow Birch. Other map markers, such as Labyrinth Entrance, do not automatically imply separate POI audio entries. **Excluded from Sharwen's Section Audio implementation; coordinate with Tapiwa.**

### Home: third-party audio widget

`Home.jsx` includes a Murf.ai embed script/widget. Its behaviour and purpose have not yet been inspected; check for overlap before replacing audio handling.

## D. Implementation and review notes (for SCRUM-17 / SCRUM-18)

- The existing section audio uses browser TTS; SCRUM-17 must use the shared prerecorded audio solution agreed with Moneab.
- Confirm section-to-recording filenames and Selected Language mappings before coding. Do not assume English-only hardcoded speech is acceptable.
- Do not use browser-generated TTS as a fallback when prerecorded audio is unavailable, in line with agreed project scope.
- No assertion is made here about the existence or correctness of `public/audio` recordings; verify this separately.
- The About FAQ currently says the Read Aloud feature uses browser TTS and Space to pause/resume; update user-visible instructions when audio controls change.
- Ecosystem has a possible `text-1g` Tailwind typo (likely meant `text-lg`), and existing green styling; handle styling in SCRUM-18, not this inventory ticket.
- Gallery references backend endpoints at `127.0.0.1:8001`; flag for the final full-site review rather than changing in SCRUM-16.
- Shared-component audio search completed: `AccessibilityButton.jsx`, `AccessibilityTab.jsx`, `navbar.jsx`, `navi.jsx`, and `Weather.jsx` are present in `src/components/`. A grep for `speechSynthesis`, `SpeechSynthesisUtterance`, `new Audio`, and `.mp3` returned no matches in those `.jsx/.tsx` components. This does not prove they contain no readable text or other audio methods; re-check if teammates change the components.

## E. Open decisions before completion

1. Confirm the complete Text-Content Section scope with the team/SRS: which of the 'no audio' text blocks must get an Audio Control?
2. Agree whether Ecosystem's Heron/Deer/Coyote flip-card narrations and Natural Burial's cards are Image Audio (Moneab) or Section Audio (Sharwen).
3. Confirm how longer modal text (Featured Species and Natural Burial popups), FAQs, species notes and timeline entries should be handled.
4. Coordinate shared player API, MP3 file naming, language-aware lookup and missing-file behaviour with Moneab.
5. Verify prerecorded MP3 assets, including any language-specific recordings, on the shared codebase.
6. Shared-component scan is complete with no audio-code matches using the search patterns above. Review active teammate changes to ensure no newly added audio controls are missing.

## F. Handoff / next Jira update

Post this inventory on SCRUM-16 as review evidence, then resolve the open scope decisions with Moneab and Tapiwa. Only move SCRUM-16 to **In Review** or **Done** when the inventory adequately covers the agreed MVP Text-Content Sections. Record **actual** hours worked in Jira (not the planned 4-hour estimate).

**Summary:** After inspecting seven React pages and scanning five shared React components for standard audio calls, the page files have **19 existing text/card browser-TTS controls**, one separately owned **Talking Trees** nearest-POI audio control, and several readable text blocks without audio controls whose coverage must be decided. This is a documented mapping baseline for SCRUM-17, not a completed audio implementation.
