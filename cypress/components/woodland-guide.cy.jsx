/**
 * @file woodland-guide.cy.jsx
 * @description Component tests for the decorative woodland guide and where it appears.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-77 | SRS: [ID 318], [ID 411], [ID 316]
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import "../../src/index.css";
import WoodlandGuide from "../../src/Components/WoodlandGuide.jsx";
import LocationFallback from "../../src/Components/LocationFallback.jsx";
import NotFound from "../../src/pages/NotFound.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

// ---------- Global constants ----------
const ALLOWED = ["#6b4f3a", "#8a6a4f", "#e8dcc8", "#c9b79c", "#c9a227", "#b9772e", "#5f7a8a", "#3e5566", "#eadfa8", "currentcolor", "none"];

/** Purpose: Mount a component inside the language provider and a router. */
function mountWith(node) {
  mount(
    <MemoryRouter>
      <LanguageProvider>{node}</LanguageProvider>
    </MemoryRouter>
  );
}

describe("Woodland guide (SCRUM-77)", () => {
  beforeEach(() => cy.clearLocalStorage());

  it("is decorative and uses only palette colours", () => {
    mountWith(<WoodlandGuide />);
    cy.get("[data-cy=woodland-guide]")
      .should("have.attr", "aria-hidden", "true")
      .and("have.attr", "focusable", "false")
      .and("not.have.attr", "role");
    cy.get("[data-cy=woodland-guide]").then(($svg) => {
      expect($svg.text().trim()).to.equal("");
      $svg.find("*").each((_, el) => {
        ["fill", "stroke"].forEach((attr) => {
          const v = el.getAttribute(attr);
          if (v) expect(ALLOWED, `${attr} ${v}`).to.include(v.toLowerCase());
        });
      });
    });
  });

  it("never grows beyond 96 pixels", () => {
    mountWith(<WoodlandGuide size={500} />);
    cy.get("[data-cy=woodland-guide]").should("have.attr", "height", "96");
  });

  it("appears on the off-the-trail page with its heading still there", () => {
    mountWith(<NotFound />);
    cy.get("[data-cy=not-found] [data-cy=woodland-guide]").should("exist");
    cy.get("[data-cy=not-found-heading]").should("not.be.empty");
  });

  it("appears in the location fallback with its message still there", () => {
    mountWith(<LocationFallback reason="denied" />);
    cy.get("[data-cy=location-fallback] [data-cy=woodland-guide]").should("exist");
    cy.get("[data-cy=location-fallback-message]").should("not.be.empty");
  });

  it("keeps the heading on the first screen of a 320 by 568 phone", () => {
    cy.viewport(320, 568);
    mountWith(<NotFound />);
    cy.get("[data-cy=not-found-heading]").then(($h) => {
      expect($h[0].getBoundingClientRect().bottom).to.be.lessThan(568);
    });
  });
});
