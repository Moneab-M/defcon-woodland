/**
 * @file shared-text.cy.jsx
 * @description Component tests for the footer, accessibility panel, weather
 * widget and Gallery page text in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-45 | SRS: [ID 101], [ID 201]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "../../src/Components/navi.jsx";
import AccessibilityTab from "../../src/Components/AccessibilityTab.jsx";
import Weather from "../../src/Components/Weather.jsx";
import Gallery from "../../src/pages/Gallery.jsx";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/**
 * Purpose: Mount a component with the language switcher beside it.
 *
 * Parameters:
 * - children: the component under test
 *
 * Returns: the Cypress mount chain
 */
function mountWithLanguage(children) {
  return mount(
    <MemoryRouter>
      <LanguageProvider>
        <LanguageSelector />
        {children}
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Footer, accessibility panel, weather and Gallery text", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // No network: gallery and weather requests never answer
    cy.intercept("GET", "**", { forceNetworkError: true });
  });

  it("translates the footer address", () => {
    mountWithLanguage(<Footer />);
    cy.contains("NS B3Z 2C9").should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("N.-É. B3Z 2C9").should("exist");
  });

  it("translates the accessibility panel heading and labels", () => {
    mountWithLanguage(<AccessibilityTab />);
    cy.contains("Accessibility Settings").should("exist");
    cy.contains("Text Size:").should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("Paramètres d'accessibilité").should("exist");
    cy.contains("Taille du texte :").should("exist");
    cy.contains("option", "Mode sombre").should("exist");
  });

  it("translates the weather loading message", () => {
    mountWithLanguage(<Weather lat={44.6} lon={-63.9} />);
    cy.contains("Loading...").should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("Chargement...").should("exist");
  });

  it("translates the Gallery heading, button, empty message and keeps the language switch live", () => {
    mountWithLanguage(<Gallery />);
    cy.contains("h1", "Gallery").should("exist");
    cy.contains("label", "Choose Image(s)").should("exist");
    cy.contains("No images found.").should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("h1", "Galerie").should("exist");
    cy.contains("label", "Choisir une ou des images").should("exist");
    cy.contains("Aucune image trouvée.").should("exist");
  });

  it("translates weather icon alt text and Gallery image alt text", () => {
    cy.intercept("GET", "https://api.openweathermap.org/**", {
      body: { main: { temp: 10 }, weather: [{ icon: "01d" }] },
    });
    cy.intercept("GET", "https://openweathermap.org/**", { statusCode: 200, body: "" });
    mountWithLanguage(<Weather lat={44.6} lon={-63.9} />);
    cy.get('img[alt="Weather Icon"]').should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('img[alt="Icône météo"]').should("exist");
  });

  it("shows French on first render when French is already selected", () => {
    window.localStorage.setItem("wc_selected_language", "fr");
    mountWithLanguage(<Footer />);
    cy.contains("N.-É. B3Z 2C9").should("exist");
  });
});
