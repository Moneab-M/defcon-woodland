/**
 * @file qrPayload.js
 * @description Builds and reads the text stored in a Talking Tree QR code.
 * Format: "wca-tree:<tree ID>". A web address ending in "/trees/<tree ID>"
 * is also accepted.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-53 | SRS: Talking Tree
 *
 * Notes:
 * - parseTreeQrPayload never throws; it returns null for anything else.
 * - Nothing is stored or logged.
 */
import { getTreeById } from "./trees.js";

export const QR_PREFIX = "wca-tree:";

const ID_PATTERN = /^[a-z0-9-]+$/;

/** Purpose: Make the QR code text for a tree ID. */
export function buildTreeQrPayload(treeId) {
  return `${QR_PREFIX}${treeId}`;
}

/** Purpose: Return the tree ID if the id is well formed and a known tree, else null. */
function knownId(id) {
  return ID_PATTERN.test(id) && getTreeById(id) ? id : null;
}

/** Purpose: Read QR text and return the Talking Tree ID, or null. Never throws. */
export function parseTreeQrPayload(text) {
  try {
    if (typeof text !== "string") return null;
    const value = text.trim();
    if (value.toLowerCase().startsWith(QR_PREFIX)) {
      return knownId(value.slice(QR_PREFIX.length));
    }
    if (/^https?:\/\//i.test(value)) {
      const match = new URL(value).pathname.match(/\/trees\/([^/]+)\/?$/);
      return match ? knownId(match[1]) : null;
    }
    return null;
  } catch {
    return null;
  }
}
