/**
 * @file accessible-names.cy.jsx
 * @description Finds the settings button and footer social links by their
 * accessible names in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-66 | SRS: WCAG 4.1.2, 1.1.1
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import AccessibilityButton from "../../src/Components/AccessibilityButton.jsx";
import { Footer } from "../../src/Components/navi.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

const NAMES = {
  en: {
    open: "Open display settings",
    close: "Close display settings",
    links: [
      "St. Margaret's Bay Stewardship Association on Facebook",
      "St. Margaret's Bay Stewardship Association on Instagram",
      "St. Margaret's Bay Stewardship Association on YouTube",
    ],
  },
  fr: {
    open: "Ouvrir les paramètres d'affichage",
    close: "Fermer les paramètres d'affichage",
    links: [
      "St. Margaret's Bay Stewardship Association sur Facebook",
      "St. Margaret's Bay Stewardship Association sur Instagram",
      "St. Margaret's Bay Stewardship Association sur YouTube",
    ],
  },
};

/**
 * Purpose: Mount the settings button and footer in the given language.
 *
 * Parameters:
 * - lang: "en" or "fr"
 */
function mountBoth(lang) {
  window.localStorage.setItem("wc_selected_language", lang);
  mount(
    <MemoryRouter>
      <LanguageProvider>
        <AccessibilityButton />
        <Footer />
      </LanguageProvider>
    </MemoryRouter>
  );
}

["en", "fr"].forEach((lang) => {
  describe(`Accessible names (${lang})`, () => {
    beforeEach(() => mountBoth(lang));

    it("names the settings button and toggles aria-expanded", () => {
      const n = NAMES[lang];
      cy.get(`[aria-label="${n.open}"]`)
        .should("have.attr", "aria-expanded", "false")
        .and("have.attr", "aria-controls", "accessibility-panel")
        .click();
      cy.get("#accessibility-panel").should("exist");
      cy.get(`[aria-label="${n.close}"]`).should("have.attr", "aria-expanded", "true").click();
      cy.get(`[aria-label="${n.open}"]`).should("have.attr", "aria-expanded", "false");
    });

    it("gives each social link a name, as a single tab stop", () => {
      NAMES[lang].links.forEach((name) => {
        cy.get(`footer a[aria-label="${name}"]`).should("have.length", 1);
      });
      cy.get("footer a").should("have.length", 3);
      cy.get("footer a button").should("have.length", 0);
      cy.get("footer button").should("have.length", 0);
    });
  });
});
