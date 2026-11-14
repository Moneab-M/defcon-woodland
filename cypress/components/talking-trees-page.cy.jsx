/**
 * @file talking-trees-page.cy.jsx
 * @description Component tests for the Talking Trees list and tree pages.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-54 | SRS: Talking Tree
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import TalkingTrees from "../../src/pages/TalkingTrees.jsx";
import TreePage from "../../src/pages/TreePage.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";
import { TALKING_TREES } from "../../src/talkingTrees/trees.js";
import en from "../../src/i18n/en.js";
import fr from "../../src/i18n/fr.js";

/** Purpose: Button so a test can change language without a reload. */
function FrenchButton() {
  const { setLanguage } = useLanguage();
  return <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>;
}

/** Purpose: Mount the two pages at a route inside the providers they need. */
function mountAt(path) {
  return mount(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <PrerecordedAudioProvider>
        <FrenchButton />
        <Routes>
          <Route path="/trees" element={<TalkingTrees />} />
          <Route path="/trees/:treeId" element={<TreePage />} />
        </Routes>
        </PrerecordedAudioProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Talking Trees pages (SCRUM-54)", () => {
  beforeEach(() => cy.clearLocalStorage());

  it("lists every tree as a link at least 44 px high", () => {
    mountAt("/trees");
    cy.get("h1").should("have.length", 1);
    cy.get("ul li").should("have.length", TALKING_TREES.length);
    TALKING_TREES.forEach((tree) => {
      cy.get(`[data-cy=tree-link-${tree.id}]`)
        .should("have.attr", "href", `/trees/${tree.id}`)
        .and("contain.text", en.trees.species[tree.species].name)
        .invoke("outerHeight")
        .should("be.at.least", 44);
    });
  });

  it("opens a tree page from the list", () => {
    mountAt("/trees");
    cy.get("[data-cy=tree-link-red-maple-1]").click();
    cy.get("[data-cy=tree-name]").should("have.text", en.trees.species.redMaple.name);
  });

  it("shows a tree in English and then French", () => {
    mountAt("/trees/yellow-birch-1");
    const s = en.trees.species.yellowBirch;
    cy.get("h1").should("have.text", s.name);
    cy.contains(s.greeting).should("be.visible");
    cy.get("[data-cy=tree-facts] li").should("have.length", s.facts.length);
    cy.get("[data-cy=tree-facts]").should("contain.text", s.facts[0]);
    cy.get("[data-cy=to-fr]").click();
    const f = fr.trees.species.yellowBirch;
    cy.get("h1").should("have.text", f.name);
    cy.contains(f.greeting).should("be.visible");
    cy.get("[data-cy=tree-facts]").should("contain.text", f.facts[0]);
    cy.get("[data-cy=tree-back-link]").should("have.attr", "href", "/trees");
  });

  it("shows a kind message and a link back for an unknown tree", () => {
    mountAt("/trees/no-such-tree");
    cy.get("[data-cy=tree-unknown]").should("have.text", en.trees.page.unknown);
    cy.get("[data-cy=tree-back-link]").should("have.attr", "href", "/trees");
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=tree-unknown]").should("have.text", fr.trees.page.unknown);
  });
});
