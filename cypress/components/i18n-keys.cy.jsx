/**
 * @file i18n-keys.cy.jsx
 * @description Fails with a readable list when a translation key exists in
 * en.js but not fr.js, or the other way round. mic.js is not checked.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-52 | SRS: [ID 101]
 */

import en from "../../src/i18n/en.js";
import fr from "../../src/i18n/fr.js";

// Keys that are intentionally English only: the Mi'kmaq notice is only ever
// shown in English (see the comment in fr.js).
const ENGLISH_ONLY = ["common.languageNotice.micNotAvailable"];

/**
 * Purpose: Flatten a dictionary to dotted key paths. Arrays add a ".length=N"
 * entry; array items that are objects add their keys as "path[i].key".
 */
function flatten(value, prefix, out) {
  if (Array.isArray(value)) {
    out.push(`${prefix}.length=${value.length}`);
    value.forEach((item, i) => {
      if (item && typeof item === "object") flatten(item, `${prefix}[${i}]`, out);
    });
  } else if (value && typeof value === "object") {
    Object.keys(value).forEach((k) => flatten(value[k], prefix ? `${prefix}.${k}` : k, out));
  } else {
    out.push(prefix);
  }
  return out;
}

describe("Translation keys match (SCRUM-52)", () => {
  it("has the same keys in en.js and fr.js", () => {
    const enKeys = new Set(flatten(en, "", []));
    const frKeys = new Set(flatten(fr, "", []));
    const onlyEn = [...enKeys].filter((k) => !frKeys.has(k) && !ENGLISH_ONLY.includes(k));
    const onlyFr = [...frKeys].filter((k) => !enKeys.has(k));
    const message =
      `\nOnly in en.js (${onlyEn.length}):\n  ${onlyEn.join("\n  ")}` +
      `\nOnly in fr.js (${onlyFr.length}):\n  ${onlyFr.join("\n  ")}\n`;
    expect(onlyEn.length + onlyFr.length, message).to.equal(0);
  });
});
