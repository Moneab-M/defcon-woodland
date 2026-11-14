/**
 * @file map-text.cy.jsx
 * @description Component tests for the Map page Page Text in English and
 * French (SCRUM-51).
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-51 | SRS: [ID 101], [ID 201]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import MapView from "../../src/pages/MapView.jsx";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/**
 * Purpose: Mount the Map page with the language selector beside it. Map tile
 * requests are stubbed so no network is needed.
 */
function mountMap() {
  cy.intercept("https://*.tile.openstreetmap.org/**", { statusCode: 200, body: "" });
  return mount(
    <LanguageProvider>
      <LanguageSelector />
      <MapView />
    </LanguageProvider>
  );
}

describe("Map page text", () => {
  beforeEach(() => {
    cy.window().then((win) => win.localStorage.removeItem("wc_selected_language"));
  });

  it("shows English text by default", () => {
    mountMap();
    cy.contains("button", "YOU ARE HERE").should("exist");
    cy.contains("button", "Return to Site Map").should("exist");
    cy.contains("North").should("exist");
    cy.contains("Map bounds, paths, and Talking Trees").should("exist");
  });

  it("switches to French without a reload", () => {
    mountMap();
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("button", "JE SUIS ICI").should("exist");
    cy.contains("button", "Revenir à la carte du site").should("exist");
    cy.contains("Nord").should("exist");
    cy.contains("Les limites de la carte").should("exist");
    cy.contains("Le GPS sert seulement").should("exist");
    cy.contains("YOU ARE HERE").should("not.exist");
  });

  it("translates the map attribution link in both languages", () => {
    mountMap();
    cy.get(".leaflet-control-attribution").should("contain", "OpenStreetMap contributors");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get(".leaflet-control-attribution").should("contain", "contributeurs d'OpenStreetMap");
  });
});
