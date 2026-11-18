/**
 * @file trees.js
 * @description The Talking Tree list: each tree's ID (used in QR codes), its
 * species key (name is in the translation files under trees.species) and the
 * id of its point on the Map page, if it has one.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-53 | SRS: Talking Tree
 *
 * Notes:
 * - No coordinates here: positions are not invented. Trees without a map
 *   point (mapPoiId null) are reached by QR code or from the list.
 * - mapPoiId links to an id in TALKING_TREE_POIS in MapView.jsx.
 */

// NEEDS VERIFICATION: species and location not yet confirmed by the client
export const TALKING_TREES = [
  // NEEDS VERIFICATION: species and location not yet confirmed by the client
  { id: "yellow-birch-1", species: "yellowBirch", mapPoiId: "yellowBirch", verified: false },
  // NEEDS VERIFICATION: species and location not yet confirmed by the client
  { id: "red-spruce-1", species: "redSpruce", mapPoiId: null, verified: false },
  // NEEDS VERIFICATION: species and location not yet confirmed by the client
  { id: "red-maple-1", species: "redMaple", mapPoiId: null, verified: false },
  // NEEDS VERIFICATION: species and location not yet confirmed by the client
  { id: "white-pine-1", species: "whitePine", mapPoiId: null, verified: false },
];

/** Purpose: Find a Talking Tree by its ID. Returns the entry or null. */
export function getTreeById(id) {
  return TALKING_TREES.find((tree) => tree.id === id) || null;
}

/** Purpose: Find a Talking Tree by its Map page point id. Returns the entry or null. */
export function getTreeByMapPoiId(poiId) {
  if (!poiId) return null;
  return TALKING_TREES.find((tree) => tree.mapPoiId === poiId) || null;
}
