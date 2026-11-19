/**
 * @file ecosystem-text.cy.jsx
 * @description Component tests for the Ecosystem page Page Text in English
 * and French, including the aria-label and alt text.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-48 | SRS: [ID 101], [ID 201]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import Ecosystem from "../../src/pages/Ecosystem.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/**
 * Purpose: Mount the Ecosystem page inside the language provider.
 *
 * Parameters:
 * - None
 *
 * Returns: the Cypress mount chain
 */
function mountEcosystem() {
  return mount(
    <LanguageProvider>
      <Ecosystem />
    </LanguageProvider>
  );
}

describe("Ecosystem page text", () => {
  beforeEach(() => {
    window.localStorage.removeItem("wc_selected_language");
  });

  it("shows English text, aria-label and alt text", () => {
    mountEcosystem();
    cy.get("h2").should("contain.text", "Ecosystem");
    cy.get("h3").first().should("have.text", "Flora");
    cy.get('button[aria-label="Read out loud"]').should("exist");
    cy.get('img[alt="Lake"]').should("exist");
  });

  it("shows French text, aria-label and alt text", () => {
    window.localStorage.setItem("wc_selected_language", "fr");
    mountEcosystem();
    cy.get("h2").should("contain.text", "Écosystème");
    cy.get("h3").first().should("have.text", "Flore");
    cy.get('button[aria-label="Lire à haute voix"]').should("exist");
    cy.get('img[alt="Lac"]').should("exist");
    cy.contains("Bouleaux jaunes").should("exist");
  });
});
