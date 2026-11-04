/**
 * @file language-selector.cy.jsx
 * @description Component tests for the Language Selector (EN / FR / Mi'kmaq).
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-7 | SRS: [ID 304], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

// ---------- Global constants ----------
const STORAGE_KEY = "wc_selected_language"; // same key LanguageContext uses
const EXPECTED_LABELS = ["English", "Français", "Mi'kmaq"];
const OPTION_SELECTOR = "[data-cy=language-selector] button";

/**
 * Purpose: Mount the Language Selector inside the LanguageProvider it needs.
 *
 * Parameters:
 * - None
 *
 * Returns: the Cypress mount chain
 */
function mountSelector() {
  return mount(
    <LanguageProvider>
      <LanguageSelector />
    </LanguageProvider>
  );
}

describe("Language Selector Component (SCRUM-7)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    mountSelector();
  });

  it("offers exactly English, Français and Mi'kmaq, in that order", () => {
    cy.get("[data-cy=language-selector]")
      .should("have.attr", "role", "group")
      .and("have.attr", "aria-label", "Language");

    cy.get(OPTION_SELECTOR).should("have.length", 3);
    EXPECTED_LABELS.forEach((label, index) => {
      cy.get(OPTION_SELECTOR).eq(index).should("have.attr", "aria-label", label);
    });
  });

  it("selects English by default", () => {
    cy.get("[data-cy=language-option-en]").should("have.attr", "aria-pressed", "true");
    cy.get("[data-cy=language-option-fr]").should("have.attr", "aria-pressed", "false");
    cy.get("[data-cy=language-option-mic]").should("have.attr", "aria-pressed", "false");
  });

  it("updates the Selected Language when Français is clicked", () => {
    cy.get("[data-cy=language-option-fr]").click();

    cy.get("[data-cy=language-option-fr]").should("have.attr", "aria-pressed", "true");
    cy.get("[data-cy=language-option-en]").should("have.attr", "aria-pressed", "false");
    cy.get("[data-cy=language-option-mic]").should("have.attr", "aria-pressed", "false");

    cy.window().its("localStorage").invoke("getItem", STORAGE_KEY).should("equal", "fr");
    cy.document().its("documentElement").should("have.attr", "lang", "fr");
  });

  it("uses native, focusable buttons so it works with the keyboard", () => {
    cy.get(OPTION_SELECTOR).each(($button) => {
      // Native <button> elements are in the Tab order and respond to Enter / Space
      expect($button.prop("tagName")).to.equal("BUTTON");
      expect($button.attr("type")).to.equal("button");
      expect($button.prop("disabled")).to.equal(false);

      cy.wrap($button).focus().should("have.focus");
    });
  });
});
