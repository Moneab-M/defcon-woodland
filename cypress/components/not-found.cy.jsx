/**
 * @file not-found.cy.jsx
 * @description Component tests for the "off the trail" page: an unknown
 * address shows it inside the header and footer, in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-74 | SRS: WCAG 2.1 AA 2.4.2
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

// ---------- Global constants ----------
const SITE = "Woodland Conservation Area";
const LANG_KEY = "wc_selected_language";

/**
 * Purpose: Mount the whole App at a route inside the same providers as main.jsx.
 */
function mountAt(path, language) {
  window.localStorage.setItem(LANG_KEY, language);
  return mount(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <App />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Off the trail page (SCRUM-74)", () => {
  beforeEach(() => cy.clearLocalStorage());

  [
    ["en", "This path leads off the trail", "Off the trail", ["Go to the Home page", "Show the Map", "Meet the Talking Trees"]],
    ["fr", "Ce chemin sort du sentier", "Hors du sentier", ["Aller à la page d'accueil", "Voir la carte", "Rencontrer les arbres parlants"]],
  ].forEach(([lang, heading, title, labels]) => {
    it(`shows the friendly page for an unknown address in ${lang}`, () => {
      mountAt("/no-such-page", lang);
      cy.get("header").should("exist");
      cy.get("footer").should("exist");
      cy.get("[data-cy=not-found]").should("be.visible");
      cy.get("[data-cy=not-found] h1").should("have.length", 1).and("have.text", heading);
      cy.get("[data-cy=not-found-heading]").should("have.focus");
      cy.document().its("title").should("eq", `${title} | ${SITE}`);
      cy.get("[data-cy=not-found] p").invoke("text").should("not.match", /404|error|erreur/i);
      [["home", "/", labels[0]], ["map", "/map", labels[1]], ["trees", "/trees", labels[2]]].forEach(
        ([name, href, label]) => {
          cy.get(`[data-cy=not-found-${name}]`)
            .should("have.attr", "href", href)
            .and("contain.text", label)
            .invoke("outerHeight")
            .should("be.gte", 44);
        }
      );
    });
  });

  it("does not show the page on a known route", () => {
    mountAt("/about", "en");
    cy.get("[data-cy=not-found]").should("not.exist");
  });
});
