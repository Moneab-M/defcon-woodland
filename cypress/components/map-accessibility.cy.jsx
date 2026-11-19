/**
 * @file map-accessibility.cy.jsx
 * @description Component tests for the Map page accessibility additions: the
 * polite status live region and named, keyboard-reachable markers (SCRUM-70).
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-70 | WCAG 1.1.1, 4.1.2, 4.1.3
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import MapView from "../../src/pages/MapView.jsx";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/** Purpose: Mount the Map page with the language selector; tiles are stubbed. */
function mountMap() {
  cy.intercept("https://*.tile.openstreetmap.org/**", { statusCode: 200, body: "" });
  return mount(
    <LanguageProvider>
      <LanguageSelector />
      <MapView />
    </LanguageProvider>
  );
}

describe("Map accessibility", () => {
  beforeEach(() => {
    cy.window().then((win) => win.localStorage.removeItem("wc_selected_language"));
  });

  it("announces the location status politely", () => {
    mountMap();
    cy.get('[data-cy="map-status"]')
      .should("have.attr", "role", "status")
      .and("have.attr", "aria-live", "polite");
  });

  it("names the trailhead marker in English and French and makes it focusable", () => {
    mountMap();
    cy.get('.leaflet-marker-icon[aria-label="Trailhead"]')
      .should("have.attr", "title", "Trailhead")
      .and("have.attr", "tabindex", "0")
      .and("have.attr", "role", "button");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('.leaflet-marker-icon[aria-label="Début du sentier"]').should("exist");
  });

  it("hides the decorative emoji from screen readers", () => {
    mountMap();
    cy.get(".emoji-marker > div").each(($el) => {
      expect($el.attr("aria-hidden")).to.equal("true");
    });
  });
});
