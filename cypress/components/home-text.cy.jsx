/**
 * @file home-text.cy.jsx
 * @description Component tests for the Home page Page Text in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-46 | SRS: [ID 101], [ID 201]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import Home from "../../src/pages/Home.jsx";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/**
 * Purpose: Mount the Home page and the Language Selector in the provider.
 *
 * Returns: the Cypress mount chain
 */
function mountHome() {
  return mount(
    <LanguageProvider>
      <LanguageSelector />
      <Home />
    </LanguageProvider>
  );
}

describe("Home Page Text (SCRUM-46)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    // No network: the weather request is stubbed with a failure.
    cy.intercept("GET", "https://api.open-meteo.com/**", { statusCode: 500, body: {} });
  });

  it("shows English heading, button and alt text by default", () => {
    mountHome();
    cy.contains("h2", "What We Do").should("exist");
    cy.contains("button", "Learn More").should("exist");
    cy.get('button[aria-label="Read out loud"]').should("have.length.greaterThan", 0);
    cy.get('img[alt="Woodland Conservation"]').should("exist");
    cy.contains("Weather unavailable. Showing fallback.").should("exist");
  });

  it("shows French text after clicking Français", () => {
    mountHome();
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("h2", "Ce que nous faisons").should("exist");
    cy.contains("button", "En savoir plus").should("exist");
    cy.get('button[aria-label="Lire à haute voix"]').should("have.length.greaterThan", 0);
    cy.get('img[alt="Bouleau jaune"]').should("exist");
    cy.contains("Météo non disponible").should("exist");
    cy.contains("What We Do").should("not.exist");
  });

  it("starts in French when the saved language is 'fr'", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    mountHome();
    cy.contains("h2", "Espèce en vedette").should("exist");
  });
});
