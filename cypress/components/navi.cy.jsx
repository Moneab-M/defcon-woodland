/**
 * @file navi.cy.jsx
 * @description Component tests for the site header (navi.jsx) Page Text in
 * English and French, and the [ID 201] 200 ms language-switch check.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 101], [ID 201]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 * - React Router MemoryRouter: https://reactrouter.com
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../src/Components/navi.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

// ---------- Global constants ----------
const MAX_SWITCH_MS = 200; // [ID 201]
const FRENCH_NAV = ["Accueil", "À propos", "Écosystème", "Galerie", "Inhumation naturelle", "Carte", "Contact"];
const ENGLISH_NAV = ["Home", "About", "Ecosystem", "Gallery", "Natural Burial", "Map", "Contact"];

/**
 * Purpose: Mount the header inside the providers it needs.
 *
 * Parameters:
 * - None
 *
 * Returns: the Cypress mount chain
 */
function mountNavbar() {
  return mount(
    <MemoryRouter>
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Header Page Text (SCRUM-8)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    // The legacy rule in index.css hides the header at 1024 px and below,
    // so test at a laptop width where it is visible.
    cy.viewport(1280, 800);
  });

  it("shows English nav links by default", () => {
    mountNavbar();
    cy.get("header nav ul a").each(($link, index) => {
      expect($link.text()).to.equal(ENGLISH_NAV[index]);
    });
    cy.get("[data-cy=language-selector]").should("have.attr", "aria-label", "Language");
  });

  it("shows French nav links and labels after clicking Français", () => {
    mountNavbar();
    cy.get("[data-cy=language-option-fr]").click();
    cy.get("header nav ul a").each(($link, index) => {
      expect($link.text()).to.equal(FRENCH_NAV[index]);
    });
    cy.get("[data-cy=language-selector]").should("have.attr", "aria-label", "Langue");
    cy.get('button[title="Clair/Sombre"]').should("exist");
  });

  it("starts in French when the saved language is 'fr'", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    mountNavbar();
    cy.contains("header nav ul a", "Accueil").should("exist");
  });

  it("updates the Page Text within 200 ms of choosing French ([ID 201], local measurement)", () => {
    mountNavbar();
    cy.get("[data-cy=language-option-fr]").then(($button) => {
      const doc = $button[0].ownerDocument;
      return new Cypress.Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("French text never appeared")), 2000);
        const observer = new MutationObserver(() => {
          if (doc.querySelector("header nav ul a")?.textContent === "Accueil") {
            observer.disconnect();
            clearTimeout(timeout);
            resolve(performance.now() - start);
          }
        });
        observer.observe(doc.body, { subtree: true, childList: true, characterData: true });
        const start = performance.now();
        $button[0].click(); // native click so the timer starts exactly at the click
      });
    }).then((elapsedMs) => {
      cy.log(`Language switch took ${elapsedMs.toFixed(1)} ms`);
      Cypress.log({ name: "switch-ms", message: elapsedMs.toFixed(1) });
      expect(elapsedMs).to.be.lessThan(MAX_SWITCH_MS);
    });
  });
});
