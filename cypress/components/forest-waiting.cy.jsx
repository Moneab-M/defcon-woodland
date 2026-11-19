/**
 * @file forest-waiting.cy.jsx
 * @description Component tests for the "the forest is listening" waiting state
 * (component alone, reduced-motion stylesheet rule, and its use on the Map page).
 * Geolocation is stubbed and map tiles are intercepted: no network, no GPS.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-73 | SRS: Talking Tree, Site Map
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import "../../src/index.css";
import ForestWaiting from "../../src/Components/ForestWaiting.jsx";
import MapView from "../../src/pages/MapView.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import { useText } from "../../src/i18n/useText.js";
import en from "../../src/i18n/en.js";
import fr from "../../src/i18n/fr.js";

/** Purpose: Show a waiting block with a translated key, and a button to switch to French. */
function Probe({ textKey }) {
  const t = useText();
  const { setLanguage } = useLanguage();
  return (
    <div>
      <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>
      <ForestWaiting message={t(textKey)} />
    </div>
  );
}

/** Purpose: Mount the Map page and stub geolocation. */
function mountMap() {
  cy.intercept("https://*.tile.openstreetmap.org/**", { statusCode: 204 });
  mount(
    <MemoryRouter>
      <LanguageProvider>
        <MapView />
      </LanguageProvider>
    </MemoryRouter>
  ).then(() => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "getCurrentPosition").as("gps");
    });
  });
}

describe("ForestWaiting (SCRUM-73)", () => {
  beforeEach(() => {
    cy.window().then((win) => win.localStorage.removeItem("wc_selected_language"));
  });

  it("shows the message, is a polite status and hides the decoration", () => {
    mount(
      <LanguageProvider>
        <Probe textKey="common.waiting.locating" />
      </LanguageProvider>
    );
    cy.get("[data-cy=forest-waiting]")
      .should("have.attr", "role", "status")
      .and("have.attr", "aria-live", "polite")
      .and("contain.text", en.common.waiting.locating);
    cy.get("[data-cy=forest-waiting-shapes]").should("have.attr", "aria-hidden", "true");
    cy.get("[data-cy=forest-waiting-shapes] svg").should("have.length", 3); // SCRUM-77: the guide is a separate fourth svg
    cy.get("[data-cy=forest-waiting] [data-cy=woodland-guide]").should("have.length", 1);
    cy.get("[data-cy=forest-waiting]").find("button, a, input, [tabindex]").should("have.length", 0);
  });

  it("shows the French text", () => {
    mount(
      <LanguageProvider>
        <Probe textKey="common.waiting.scanning" />
      </LanguageProvider>
    );
    cy.get("[data-cy=forest-waiting]").should("contain.text", en.common.waiting.scanning);
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=forest-waiting]").should("contain.text", fr.common.waiting.scanning);
  });

  it("is slow, uses allowed colours and does not use bold", () => {
    mount(
      <LanguageProvider>
        <Probe textKey="common.waiting.noTreeNearby" />
      </LanguageProvider>
    );
    cy.get(".forest-waiting-leaf").first().should("have.css", "animation-duration", "2s");
    cy.get(".forest-waiting-leaf path").each(($p) => {
      expect(["#C9A227", "#B9772E", "#5F7A8A"]).to.include($p.attr("fill"));
    });
    cy.get("[data-cy=forest-waiting] span").last().then(($s) => {
      expect(parseInt($s.css("font-weight"), 10)).to.be.at.most(400);
    });
  });

  it("stylesheet stops the animation under prefers-reduced-motion: reduce", () => {
    mount(
      <LanguageProvider>
        <Probe textKey="common.waiting.locating" />
      </LanguageProvider>
    );
    cy.document().then((doc) => {
      const rules = [];
      Array.from(doc.styleSheets).forEach((sheet) => {
        try {
          Array.from(sheet.cssRules).forEach((r) => {
            if (r.type === CSSRule.MEDIA_RULE && /prefers-reduced-motion:\s*reduce/.test(r.conditionText)) {
              Array.from(r.cssRules).forEach((inner) => rules.push(inner.cssText));
            }
          });
        } catch (e) {
          // a stylesheet from another origin cannot be read; skip it
        }
      });
      const mine = rules.filter((text) => text.includes("forest-waiting-leaf"));
      expect(mine.length, "reduced-motion rule for forest-waiting").to.be.greaterThan(0);
      expect(mine.join(" ")).to.match(/animation[^;]*\bnone\b/);
    });
  });

  it("Map page shows the locating state while the position is pending", () => {
    mountMap();
    cy.contains("button", en.map.youAreHere).click();
    cy.get("@gps").should("have.been.calledOnce");
    cy.get("[data-cy=map-status] [data-cy=forest-waiting]").should("contain.text", en.common.waiting.locating);
    cy.get("[data-cy=forest-waiting]").should("have.length", 1);
  });

  it("Map page shows the no tree nearby state when out of range", () => {
    mountMap();
    cy.get("@gps").then((stub) => {
      stub.callsFake((ok) => ok({ coords: { latitude: 44.6, longitude: -63.9 } }));
    });
    cy.contains("button", en.map.youAreHere).click();
    cy.get("[data-cy=map-no-tree-nearby]").should("contain.text", en.common.waiting.noTreeNearby);
    cy.get("[data-cy=map-status]").should("contain.text", en.map.status.found);
    cy.contains("button", en.map.returnToSiteMap).should("be.visible");
  });
});
