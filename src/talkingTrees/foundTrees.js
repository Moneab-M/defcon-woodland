/**
 * @file foundTrees.js
 * @description Remembers which Talking Trees a visitor has found by scanning,
 * on this device only.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-76 | SRS: Talking Tree, [ID 101]
 *
 * Notes:
 * - Privacy: the only thing stored is a JSON array of tree ID strings in
 *   localStorage. No time, no place, no counters. Nothing is sent anywhere.
 * - If storage is blocked (private browsing) everything still works: the list
 *   is kept in memory for the current visit.
 */

import { TALKING_TREES } from "./trees";

export const STORAGE_KEY = "wca_found_trees";

let memoryList = []; // used only when storage cannot be read or written

/** Purpose: Keep only known tree IDs, once each, in the order of the tree list. */
function cleanList(value) {
  if (!Array.isArray(value)) return [];
  return TALKING_TREES.map((tree) => tree.id).filter((id) => value.includes(id));
}

/** Purpose: Read the stored list. Returns array of known IDs; [] on any problem. */
function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    return cleanList(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Purpose: Save the list; falls back to memory when storage is blocked. */
function writeStored(list) {
  memoryList = list;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage blocked: the in-memory copy keeps this visit working.
  }
}

/** Purpose: The IDs of the trees found so far. Returns an array of strings. */
export function getFoundTrees() {
  const stored = readStored();
  return stored === null ? [...memoryList] : stored;
}

/**
 * Purpose: Remember that a tree was found by scanning.
 *
 * Returns: { found: list of IDs, isNew: this tree was not found before,
 * isFirst: it is the very first tree, isAll: every tree is now found }
 */
export function markTreeFound(treeId) {
  const before = getFoundTrees();
  const known = TALKING_TREES.some((tree) => tree.id === treeId);
  if (!known || before.includes(treeId)) {
    return { found: before, isNew: false, isFirst: false, isAll: false };
  }
  const found = cleanList([...before, treeId]);
  writeStored(found);
  return {
    found,
    isNew: true,
    isFirst: before.length === 0,
    isAll: found.length === TALKING_TREES.length,
  };
}

/** Purpose: Forget every found tree ("Start again"). */
export function resetFoundTrees() {
  memoryList = [];
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: nothing stored to remove.
  }
}
