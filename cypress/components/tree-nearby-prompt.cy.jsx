/**
 * @file tree-nearby-prompt.cy.jsx
 * @description Component tests for the "a tree is near" prompt on the Map page.
 * Geolocation is stubbed and map tiles are intercepted: no network, no GPS.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-59 | SRS: [ID 104], [ID 204]
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import MapView from "../../src/pages/MapView.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";

/** Purpose: Button so a test can change language without a reload. */
function FrenchButton() {
  const { setLanguage } = useLanguage();
  return <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>;
}

/** Purpose: Mount the Map page with a stubbed position. */
function mountMap(lat, lng) {
  cy.intercept("https://*.tile.openstreetmap.org/**", { statusCode: 204 });
  mount(
    <MemoryRouter>
      <LanguageProvider>
        <FrenchButton />
        <MapView />
      </LanguageProvider>
    </MemoryRouter>
  ).then(() => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((ok) =>
        ok({ coords: { latitude: lat, longitude: lng } })
      );
    });
  });
}

describe("Tree nearby prompt (SCRUM-59)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows within 2 seconds, names the tree, links and dismisses", () => {
    mountMap(44.62464, -63.920329);
    cy.window().then((win) => {
      const start = win.performance.now();
      cy.contains("button", "Show where I am").click();
      cy.get("[data-cy=tree-nearby-prompt]").should("be.visible").then(() => {
        expect(win.performance.now() - start).to.be.lessThan(2000);
      });
    });
    cy.get("[data-cy=tree-nearby-prompt]")
      .should("have.attr", "role", "status")
      .and("have.attr", "aria-live", "polite")
      .and("contain.text", "Yellow birch")
      .and("not.contain.text", " m)");
    cy.get("[data-cy=tree-nearby-scan]").should("have.attr", "href", "/trees#scan")
      .invoke("outerHeight").should("be.gte", 44);
    cy.get("[data-cy=tree-nearby-meet]").should("have.attr", "href", "/trees/yellow-birch-1");
    cy.get("[data-cy=tree-nearby-dismiss]").click();
    cy.get("[data-cy=tree-nearby-prompt]").should("not.exist");
  });

  it("names the tree in French", () => {
    mountMap(44.62464, -63.920329);
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=to-fr]").next("div").find("button").first().click();
    cy.get("[data-cy=tree-nearby-prompt]").should("contain.text", "Bouleau jaune");
  });

  it("shows nothing out of range", () => {
    mountMap(44.63, -63.93);
    cy.get("[data-cy=to-fr]").next("div").find("button").first().click();
    cy.get("[data-cy=tree-nearby-prompt]").should("not.exist");
  });

  it("shows nothing at an in-range point that is not a Talking Tree", () => {
    mountMap(44.626556, -63.923382);
    cy.contains("button", "Show where I am").click();
    cy.contains("Play Audio").should("exist");
    cy.get("[data-cy=tree-nearby-prompt]").should("not.exist");
  });
});
