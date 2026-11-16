/**
 * @file about-text.cy.jsx
 * @description Component tests for the About page Page Text in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-47 | SRS: [ID 101], [ID 201]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import About from "../../src/pages/About.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/**
 * Purpose: Mount the About page inside the language provider.
 *
 * Parameters:
 * - None
 *
 * Returns: the Cypress mount chain
 */
function mountAbout() {
  return mount(
    <LanguageProvider>
      <About />
    </LanguageProvider>
  );
}

describe("About page text", () => {
  beforeEach(() => {
    cy.window().then((win) => win.localStorage.removeItem("wc_selected_language"));
  });

  it("shows English heading, button and alt text", () => {
    mountAbout();
    cy.contains("h1", "About St. Margaret’s Bay Woodland Conservation").should("exist");
    cy.contains("button", "Dyslexia Font").should("exist");
    cy.get('img[alt="Green ferns in a woodland"]').should("exist");
    cy.contains("h3", "Species Spotlight").should("exist");
  });

  it("shows French heading, button and alt text", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    mountAbout();
    cy.contains("h1", "À propos de la conservation des boisés de St. Margaret’s Bay").should("exist");
    cy.contains("button", "Police pour la dyslexie").should("exist");
    cy.get('img[alt="Des fougères vertes dans un boisé"]').should("exist");
    cy.contains("h3", "Espèces à découvrir").should("exist");
    cy.contains("About Us").should("not.exist");
  });
});
