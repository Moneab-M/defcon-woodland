/**
 * @file PrerecordedAudioContext.jsx
 * @description The one Prerecorded Audio Player for the whole website. It plays a
 * prerecorded MP3 and makes sure only one recording plays at a time. Used by the
 * Image Audio Button now, and reusable for Section Text audio.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-9 | SRS: [ID 103], [ID 307]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React Context: https://react.dev/reference/react/createContext
 * - HTMLAudioElement: https://developer.mozilla.org/docs/Web/API/HTMLAudioElement
 *
 * API: const { playingId, unavailableId, currentTime, toggle, stop } = usePrerecordedAudio();
 * - currentTime:   seconds played so far in the current recording (0 when nothing
 *                  plays), updated on the audio element's "timeupdate" event. Used
 *                  for captions (SCRUM-57).
 * - playingId:     id of the recording playing now, or null.
 * - unavailableId: id of the last recording that failed to load or play, or null
 *                  (cleared on the next toggle).
 * - toggle(id, src, { onUnavailable }): if `id` is playing, stop it; otherwise stop
 *                  whatever is playing and play `src` for `id`. The optional third
 *                  argument may hold an onUnavailable callback, called if it fails.
 *                  If `src` is empty nothing plays and `id` is marked unavailable.
 * - stop():        stop whatever is playing.
 * Use an id that names the kind of audio, e.g. "image:about" or "section:about".
 *
 * Notes:
 * - Nothing auto-plays: playback starts only when toggle() is called.
 * - Playback stops when the provider unmounts.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const PrerecordedAudioContext = createContext(null);

/**
 * Purpose: Provide the shared Prerecorded Audio Player to every component inside it.
 *
 * Parameters:
 * - children: the components to wrap (the whole App)
 *
 * Pseudo-code:
 * 1. Keep one Audio element and the id of what is playing.
 * 2. toggle(): stop the current recording, then play the new one unless it was the same id.
 * 3. On "ended" go back to not playing; on an error also mark the id unavailable.
 */
export function PrerecordedAudioProvider({ children }) {
  const audioRef = useRef(null);
  const playingIdRef = useRef(null);
  const tokenRef = useRef(0); // changes on every toggle/stop so late events from an older play are ignored
  const [playingId, setPlayingIdState] = useState(null);
  const [unavailableId, setUnavailableId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Keep the ref and the state in step
  const setPlayingId = useCallback((id) => {
    playingIdRef.current = id;
    setPlayingIdState(id);
  }, []);

  // Stop whatever is playing
  const stop = useCallback(() => {
    tokenRef.current += 1;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      audio.ontimeupdate = null;
    }
    setCurrentTime(0);
    setPlayingId(null);
  }, [setPlayingId]);

  // Play `src` for `id`, or stop it if `id` is already playing
  const toggle = useCallback(
    (id, src, options = {}) => {
      setUnavailableId(null);
      if (playingIdRef.current === id) {
        stop();
        return;
      }
      stop();
      if (!src) {
        // No recording for this request: show it as unavailable, play nothing
        setUnavailableId(id);
        if (typeof options.onUnavailable === "function") options.onUnavailable();
        return;
      }
      const token = tokenRef.current; // this play's token
      if (!audioRef.current) audioRef.current = new Audio();
      const audio = audioRef.current;

      // Back to not playing, remembering the failure if there was one
      const finish = (failed) => {
        if (tokenRef.current !== token || playingIdRef.current !== id) return; // a newer play or stop took over
        audio.onended = null;
        audio.onerror = null;
        audio.ontimeupdate = null;
        setCurrentTime(0);
        setPlayingId(null);
        if (failed) {
          setUnavailableId(id);
          if (typeof options.onUnavailable === "function") options.onUnavailable();
        }
      };

      audio.onended = () => finish(false);
      audio.onerror = () => finish(true);
      audio.ontimeupdate = () => {
        if (tokenRef.current === token) setCurrentTime(audio.currentTime || 0);
      };
      audio.src = src;
      setPlayingId(id);
      try {
        const started = audio.play();
        if (started && typeof started.catch === "function") {
          started.catch(() => finish(true));
        }
      } catch {
        finish(true);
      }
    },
    [stop, setPlayingId]
  );

  // Stop playback when the provider goes away
  useEffect(() => () => stop(), [stop]);

  const value = useMemo(
    () => ({ playingId, unavailableId, currentTime, toggle, stop }),
    [playingId, unavailableId, currentTime, toggle, stop]
  );

  return (
    <PrerecordedAudioContext.Provider value={value}>
      {children}
    </PrerecordedAudioContext.Provider>
  );
}

/**
 * Purpose: Let any component play, stop or check the shared recording.
 *
 * Usage: const { playingId, unavailableId, currentTime, toggle, stop } = usePrerecordedAudio();
 *
 * Returns: { playingId, unavailableId, currentTime, toggle, stop }
 */
export function usePrerecordedAudio() {
  const context = useContext(PrerecordedAudioContext);
  if (!context) {
    throw new Error("usePrerecordedAudio must be used inside <PrerecordedAudioProvider>");
  }
  return context;
}
