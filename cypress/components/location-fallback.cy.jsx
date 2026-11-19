/**
 * @file location-fallback.cy.jsx
 * @description Component tests for the location fallback on the Map page.
 * Geolocation is stubbed and map tiles are intercepted: no network, no GPS.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-60 | SRS: [ID 104], [ID 204]
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

/** Purpose: Mount the Map page and stub geolocation with a spy. */
function mountMap() {
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
      cy.stub(win.navigator.geolocation, "getCurrentPosition").as("gps");
    });
  });
}

describe("Location fallback (SCRUM-60)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("asks for nothing on load and explains first", () => {
    mountMap();
    cy.get("@gps").should("not.have.been.called");
    cy.contains("stays on your device").should("exist");
    cy.get("[data-cy=location-fallback]").should("not.exist");
  });

  it("shows the denied message with both links, then hides on success", () => {
    mountMap();
    cy.get("@gps").invoke("callsFake", (ok, fail) => fail({ code: 1 }));
    cy.contains("button", "Show where I am").click();
    cy.get("[data-cy=location-fallback]")
      .should("have.attr", "role", "status")
      .and("have.attr", "aria-live", "polite")
      .and("contain.text", "That's okay. You can explore without sharing where you are.");
    cy.get("[data-cy=location-fallback-scan]").should("have.attr", "href", "/trees#scan")
      .invoke("outerHeight").should("be.gte", 44);
    cy.get("[data-cy=location-fallback-list]").should("have.attr", "href", "/trees");

    cy.get("@gps").invoke("callsFake", (ok) => ok({ coords: { latitude: 44.63, longitude: -63.93 } }));
    cy.contains("button", "Show where I am").click();
    cy.get("[data-cy=location-fallback]").should("not.exist");
  });

  it("shows the unavailable message for codes 2 and 3", () => {
    mountMap();
    cy.get("@gps").invoke("callsFake", (ok, fail) => fail({ code: 2 }));
    cy.contains("button", "Show where I am").click();
    cy.get("[data-cy=location-fallback]")
      .should("contain.text", "The forest is hiding your signal for now.");
    cy.get("@gps").invoke("callsFake", (ok, fail) => fail({ code: 3 }));
    cy.contains("button", "Show where I am").click();
    cy.get("[data-cy=location-fallback]")
      .should("contain.text", "The forest is hiding your signal for now.");
  });

  it("shows the message and links in French", () => {
    mountMap();
    cy.get("@gps").invoke("callsFake", (ok, fail) => fail({ code: 1 }));
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=to-fr]").next("div").find("button").first().click();
    cy.get("button").contains("Montrer où je suis").click();
    cy.get("[data-cy=location-fallback]").should("contain.text", "Ce n'est pas grave.");
    cy.get("[data-cy=location-fallback-scan]").should("have.attr", "href", "/trees#scan");
    cy.get("[data-cy=location-fallback-list]").should("have.attr", "href", "/trees");
  });
});
