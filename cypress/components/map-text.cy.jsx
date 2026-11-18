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
    cy.contains("button", "Show where I am").should("exist");
    cy.contains("button", "Return to Site Map").should("exist");
    cy.contains("North").should("exist");
    cy.contains("The map, the paths and the Talking Trees").should("exist");
  });

  it("switches to French without a reload", () => {
    mountMap();
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("button", "Montrer où je suis").should("exist");
    cy.contains("button", "Revenir à la carte du site").should("exist");
    cy.contains("Nord").should("exist");
    cy.contains("La carte, les sentiers et les arbres parlants").should("exist");
    cy.contains("Ta position sert seulement").should("exist");
    cy.contains("Show where I am").should("not.exist");
  });

  it("translates the map attribution link in both languages", () => {
    mountMap();
    cy.get(".leaflet-control-attribution").should("contain", "OpenStreetMap contributors");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get(".leaflet-control-attribution").should("contain", "contributeurs d'OpenStreetMap");
  });
});
