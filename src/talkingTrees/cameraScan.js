/**
 * @file cameraScan.js
 * @description Camera and QR code detector for the tree sign scanner.
 * scanDeps is a mutable object so tests can replace the camera and detector.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-55 | SRS: Talking Tree
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Barcode Detection API (native): https://developer.mozilla.org/docs/Web/API/Barcode_Detection_API
 * - barcode-detector (ponyfill, used only if the browser has no QR support): https://github.com/Sec-ant/barcode-detector
 * - zxing-wasm (inside barcode-detector): https://github.com/Sec-ant/zxing-wasm
 *
 * Notes:
 * - Camera frames are only read by the detector. They are never stored,
 *   logged or sent.
 * - The ponyfill is downloaded from this site only when needed, and its
 *   .wasm file is bundled by Vite and served from this site. Nothing is
 *   fetched from a CDN or any other website.
 */

/** Purpose: Ask for the rear camera (video only). Rejects with a clear error if there is no camera API. */
function getStream() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.reject(new Error("Camera is not available"));
  }
  return navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
}

/** Purpose: True when the browser's own detector can read QR codes. */
async function nativeSupportsQr() {
  if (typeof window === "undefined" || !("BarcodeDetector" in window)) return false;
  try {
    const formats = await window.BarcodeDetector.getSupportedFormats();
    return formats.includes("qr_code");
  } catch {
    return false;
  }
}

/**
 * Purpose: Make a detector with detect(videoElement) -> [{ rawValue }].
 * Uses the native detector when it can read QR codes, else the self-hosted ponyfill.
 */
async function createDetector() {
  if (await nativeSupportsQr()) {
    return new window.BarcodeDetector({ formats: ["qr_code"] });
  }
  const [{ BarcodeDetector, prepareZXingModule }, wasm] = await Promise.all([
    import("barcode-detector/ponyfill"),
    import("zxing-wasm/reader/zxing_reader.wasm?url"),
  ]);
  const wasmUrl = wasm.default;
  // Serve the .wasm from this site instead of the default CDN.
  prepareZXingModule({
    overrides: {
      locateFile: (path, prefix) => (path.endsWith(".wasm") ? wasmUrl : prefix + path),
    },
  });
  return new BarcodeDetector({ formats: ["qr_code"] });
}

export const scanDeps = { getStream, createDetector };
