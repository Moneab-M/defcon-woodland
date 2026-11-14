/**
 * @file use-text.cy.jsx
 * @description Component tests for the Localized Page Text Lookup (useText)
 * and the Mi'kmaq "not available yet" notice.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 101], [ID 410]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import { useText } from "../../src/i18n/useText.js";
import { LANGUAGE_STATUS } from "../../src/i18n/languageStatus.js";
import LanguageNotice from "../../src/Components/LanguageNotice.jsx";
import fr from "../../src/i18n/fr.js";

// ---------- Global constants ----------
const TEST_KEY = "common.nav.home";
const ENGLISH_TEXT = "Home";
const FRENCH_TEXT = "Accueil";

/**
 * Purpose: Small test-only component that shows t(TEST_KEY) and has one
 * button per language, so tests can switch language like the selector does.
 *
 * Parameters:
 * - None
 *
 * Returns: JSX.Element
 */
function TextProbe() {
  const t = useText();
  const { setLanguage } = useLanguage();
  return (
    <div>
      <p data-cy="probe-text">{t(TEST_KEY)}</p>
      <button type="button" data-cy="set-en" onClick={() => setLanguage("en")}>en</button>
      <button type="button" data-cy="set-fr" onClick={() => setLanguage("fr")}>fr</button>
      <button type="button" data-cy="set-mic" onClick={() => setLanguage("mic")}>mic</button>
    </div>
  );
}

/**
 * Purpose: Mount TextProbe and LanguageNotice inside the LanguageProvider.
 *
 * Parameters:
 * - None
 *
 * Returns: the Cypress mount chain
 */
function mountProbe() {
  return mount(
    <LanguageProvider>
      <LanguageNotice />
      <TextProbe />
    </LanguageProvider>
  );
}

describe("useText lookup (SCRUM-8)", () => {
  const savedFrench = fr.common.nav.home;

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  afterEach(() => {
    fr.common.nav.home = savedFrench; // undo the "missing key" test even if it failed
  });

  it("returns English by default", () => {
    mountProbe();
    cy.get("[data-cy=probe-text]").should("have.text", ENGLISH_TEXT);
  });

  it("returns French after setLanguage('fr')", () => {
    mountProbe();
    cy.get("[data-cy=set-fr]").click();
    cy.get("[data-cy=probe-text]").should("have.text", FRENCH_TEXT);
  });

  it("falls back to English (and warns) when a French key is missing", () => {
    // Remove the French text for this test only; afterEach puts it back
    delete fr.common.nav.home;

    cy.window().then((win) => cy.spy(win.console, "warn").as("warn"));
    mountProbe();
    cy.get("[data-cy=set-fr]").click();
    cy.get("[data-cy=probe-text]").should("have.text", ENGLISH_TEXT);
    cy.get("@warn").should("have.been.calledWithMatch", /Missing "fr" text for "common.nav.home"/);
  });

  it("shows English, not Mi'kmaq, while Mi'kmaq is unverified ([ID 410])", () => {
    expect(LANGUAGE_STATUS.mic.verified).to.equal(false);

    mountProbe();
    cy.get("[data-cy=language-notice]").should("not.exist");

    cy.get("[data-cy=set-mic]").click();
    cy.get("[data-cy=probe-text]").should("have.text", ENGLISH_TEXT);
    cy.get("[data-cy=language-notice]")
      .should("have.text", "Mi'kmaq text is not available yet.")
      .and("have.attr", "lang", "en");

    cy.get("[data-cy=set-en]").click();
    cy.get("[data-cy=language-notice]").should("not.exist");
  });
});
