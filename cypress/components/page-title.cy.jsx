/**
 * @file page-title.cy.jsx
 * @description Component tests for PageTitle: one translated document.title
 * per route, updated on language change without a reload.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-52 | SRS: WCAG 2.1 AA 2.4.2
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import PageTitle from "../../src/Components/PageTitle.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";

// ---------- Global constants ----------
const SITE = "Woodland Conservation Area";
const ROUTES = [
  ["/", "Home", "Accueil"],
  ["/about", "About", "À propos"],
  ["/gallery", "Gallery", "Galerie"],
  ["/ecosystem", "Ecosystem", "Écosystème"],
  ["/NaturalBurial", "Natural Burial", "Inhumation naturelle"],
  ["/naturalburial", "Natural Burial", "Inhumation naturelle"],
  ["/contacts", "Contact", "Contact"],
  ["/map", "Map", "Carte"],
];

/**
 * Purpose: Small button so the test can change language without a reload.
 */
function FrenchButton() {
  const { setLanguage } = useLanguage();
  return <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>;
}

/**
 * Purpose: Mount PageTitle at a route inside the providers it needs.
 */
function mountAt(path) {
  return mount(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <PageTitle />
        <FrenchButton />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Page titles (SCRUM-52)", () => {
  beforeEach(() => cy.clearLocalStorage());

  ROUTES.forEach(([path, en, fr]) => {
    it(`sets English and French titles for ${path}`, () => {
      mountAt(path);
      cy.document().its("title").should("eq", `${en} | ${SITE}`);
      cy.get("[data-cy=to-fr]").click();
      cy.document().its("title").should("eq", `${fr} | ${SITE}`);
    });
  });

  it("gives every route a different title", () => {
    const titles = new Set();
    ROUTES.slice(0, 5).concat(ROUTES.slice(6)).forEach(([, en]) => titles.add(en));
    expect(titles.size).to.equal(7);
  });

  it("titles the trees list and a tree page (SCRUM-54)", () => {
    mountAt("/trees");
    cy.document().its("title").should("eq", `Talking Trees | ${SITE}`);
    cy.get("[data-cy=to-fr]").click();
    cy.document().its("title").should("eq", `Arbres parlants | ${SITE}`);
  });

  it("titles a tree page with the species name (SCRUM-54)", () => {
    mountAt("/trees/yellow-birch-1");
    cy.document().its("title").should("eq", `Yellow birch | ${SITE}`);
    cy.get("[data-cy=to-fr]").click();
    cy.document().its("title").should("eq", `Bouleau jaune | ${SITE}`);
  });

  it("uses the not-found title for an unknown path", () => {
    mountAt("/nope");
    cy.document().its("title").should("eq", `Page not found | ${SITE}`);
    cy.get("[data-cy=to-fr]").click();
    cy.document().its("title").should("eq", `Page introuvable | ${SITE}`);
  });
});
