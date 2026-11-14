/**
 * @file QrScanner.jsx
 * @description A dialog that reads the QR code on a Talking Tree sign with the
 * device camera. It explains first, asks for the camera only after the visitor
 * taps "Turn on the camera", and works without the camera.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-55 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React: https://react.dev
 * - MediaDevices.getUserMedia: https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia
 *
 * Notes:
 * - Camera pictures stay on the device: they are never stored, logged or sent.
 * - The camera is stopped when a code is read, when the dialog closes, when
 *   the component unmounts and when the page is hidden.
 * - Escape closes the dialog. Focus moves into it, stays inside it, and goes
 *   back to the button that opened it.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useText } from "../i18n/useText";
import { BUTTON_CLASSES } from "./controlStyles";
import { scanDeps } from "../talkingTrees/cameraScan";
import { parseTreeQrPayload } from "../talkingTrees/qrPayload";

const SCAN_INTERVAL_MS = 250; // about 4 checks a second

/** Purpose: Stop every track of a camera stream. */
function stopStream(stream) {
  if (stream) stream.getTracks().forEach((track) => track.stop());
}

/**
 * Purpose: The dialog itself. Mounted only while open, so unmounting stops the camera.
 *
 * Params: onClose - close and return focus to the opener
 *         onFound(treeId) - a tree code was read
 *         onPickFromList - close and move focus to the tree list
 */
function ScannerPanel({ onClose, onFound, onPickFromList }) {
  const t = useText();
  const [phase, setPhase] = useState("explain"); // explain | scanning | denied
  const [notTree, setNotTree] = useState(false);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const aliveRef = useRef(true);

  /** Purpose: Stop checking and switch the camera off. */
  const stopCamera = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    stopStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  /** Purpose: Ask for the camera (after the visitor's tap) and start looking for a code. */
  const startCamera = useCallback(async () => {
    setNotTree(false);
    try {
      const stream = await scanDeps.getStream();
      if (!aliveRef.current) {
        stopStream(stream);
        return;
      }
      streamRef.current = stream;
      setPhase("scanning");
      const detector = await scanDeps.createDetector();
      if (!aliveRef.current) return;
      let busy = false;
      timerRef.current = setInterval(async () => {
        const video = videoRef.current;
        if (busy || !video || !streamRef.current) return;
        busy = true;
        try {
          const codes = await detector.detect(video);
          if (!aliveRef.current || !streamRef.current) return;
          let treeId = null;
          let sawOther = false;
          for (const code of codes || []) {
            const id = parseTreeQrPayload(code.rawValue);
            if (id) {
              treeId = id;
              break;
            }
            sawOther = true;
          }
          if (treeId) {
            stopCamera();
            onFound(treeId);
          } else {
            setNotTree(sawOther);
          }
        } catch {
          // A frame that cannot be read is skipped; keep looking.
        } finally {
          busy = false;
        }
      }, SCAN_INTERVAL_MS);
    } catch {
      stopCamera();
      if (aliveRef.current) setPhase("denied");
    }
  }, [onFound, stopCamera]);

  // Attach the stream to the video once it is on screen.
  useEffect(() => {
    if (phase === "scanning" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  // Move focus to the heading whenever the step changes.
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [phase]);

  // Stop the camera on unmount and when the page is hidden.
  useEffect(() => {
    aliveRef.current = true;
    const onVisibility = () => {
      if (document.hidden) {
        stopCamera();
        setPhase((p) => (p === "scanning" ? "explain" : p));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      aliveRef.current = false;
      document.removeEventListener("visibilitychange", onVisibility);
      stopCamera();
    };
  }, [stopCamera]);

  /** Purpose: Escape closes; Tab stays inside the dialog. */
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])");
    if (items.length === 0) {
      event.preventDefault();
      headingRef.current.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === headingRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-cy="scanner-overlay">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-scanner-heading"
        onKeyDown={handleKeyDown}
        className="w-full max-w-md max-h-full overflow-auto rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/20 p-5"
        data-cy="scanner-dialog"
      >
        <h2 id="qr-scanner-heading" ref={headingRef} tabIndex={-1} className="text-2xl leading-[1.2] mb-3 focus:outline-none">
          {t("trees.scanner.title")}
        </h2>

        {phase === "explain" && (
          <>
            <p className="text-lg leading-[1.2] mb-4" data-cy="scanner-explain">{t("trees.scanner.explain")}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={BUTTON_CLASSES} onClick={startCamera} data-cy="scanner-turn-on">
                {t("trees.scanner.turnOn")}
              </button>
              <button type="button" className={BUTTON_CLASSES} onClick={onClose} data-cy="scanner-not-now">
                {t("trees.scanner.notNow")}
              </button>
            </div>
          </>
        )}

        {phase === "scanning" && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label={t("trees.scanner.videoLabel")}
              className="w-full rounded-md bg-black/10 mb-3"
              data-cy="scanner-video"
            />
            <p role="status" className="text-lg leading-[1.2] mb-4" data-cy="scanner-status">
              {notTree ? t("trees.scanner.notTree") : t("trees.scanner.looking")}
            </p>
            <button type="button" className={BUTTON_CLASSES} onClick={onClose} data-cy="scanner-close">
              {t("trees.scanner.close")}
            </button>
          </>
        )}

        {phase === "denied" && (
          <>
            <p role="status" className="text-lg leading-[1.2] mb-4" data-cy="scanner-denied">{t("trees.scanner.denied")}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={BUTTON_CLASSES} onClick={onPickFromList} data-cy="scanner-pick-list">
                {t("trees.scanner.pickFromList")}
              </button>
              <button type="button" className={BUTTON_CLASSES} onClick={onClose} data-cy="scanner-close">
                {t("trees.scanner.close")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Purpose: Show the scanner dialog when open is true.
 *
 * Params: open - boolean
 *         onClose - called when the visitor closes it (focus goes back to the opener)
 *         onFound(treeId) - called with the tree ID of a scanned sign
 *         onPickFromList - called when the visitor chooses to pick from the list
 */
export default function QrScanner({ open, onClose, onFound, onPickFromList }) {
  const openerRef = useRef(null);
  const skipRestoreRef = useRef(false);

  // Remember the opener (before the dialog takes focus), and give focus back to it when the dialog goes away.
  useLayoutEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    skipRestoreRef.current = false;
    return () => {
      const opener = openerRef.current;
      if (!skipRestoreRef.current && opener && opener.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;

  /** Purpose: Close and move focus to the tree list instead of the opener. */
  function pickFromList() {
    skipRestoreRef.current = true;
    onPickFromList();
  }

  return <ScannerPanel onClose={onClose} onFound={onFound} onPickFromList={pickFromList} />;
}
