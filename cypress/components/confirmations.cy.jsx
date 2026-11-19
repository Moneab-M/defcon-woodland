/**
 * @file confirmations.cy.jsx
 * @description Component tests for the scan confirmation (tree page) and the
 * language-change confirmation (App).
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-75 | SRS: [ID 101], [ID 316], [ID 317]
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter, Link } from "react-router-dom";
import App from "../../src/App.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

/** Purpose: Mount the real App with the same providers as src/main.jsx. */
function mountApp(entry) {
  mount(
    <MemoryRouter initialEntries={[entry]}>
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <App />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Language confirmation", () => {
  beforeEach(() => cy.window().then((w) => w.localStorage.removeItem("wc_selected_language")));

  it("is not shown on first load", () => {
    mountApp("/about");
    cy.get('[data-cy="language-confirmation"]').should("not.exist");
  });

  it("is not shown when a stored language is restored", () => {
    cy.window().then((w) => w.localStorage.setItem("wc_selected_language", "fr"));
    mountApp("/about");
    cy.get('[data-cy="language-confirmation"]').should("not.exist");
  });

  it("shows in the new language, keeps focus, and follows later changes", () => {
    mountApp("/about");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('[data-cy="language-confirmation"]').should("contain.text", "Les bois parlent maintenant français.");
    cy.get('[data-cy="language-confirmation"] [role="status"]').should("exist");
    cy.focused().should("have.attr", "data-cy", "language-option-fr");
    cy.get('[data-cy="language-option-en"]').click();
    cy.get('[data-cy="language-confirmation"]').should("contain.text", "The woods now speak English.");
  });

  it("can be dismissed", () => {
    mountApp("/about");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('[data-cy="language-confirmation"] [data-cy="gentle-message-dismiss"]').click();
    cy.get('[data-cy="language-confirmation"]').should("not.exist");
  });

  it("shows nothing for Mi'kmaq", () => {
    mountApp("/about");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('[data-cy="language-confirmation"]').should("exist");
    cy.get('[data-cy="language-option-mic"]').click();
    cy.get('[data-cy="language-confirmation"]').should("not.exist");
  });

  it("goes away on the next navigation", () => {
    mountApp("/about");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('[data-cy="language-confirmation"]').should("exist");
    cy.contains("a", "Galerie").first().click({ force: true });
    cy.get('[data-cy="language-confirmation"]').should("not.exist");
  });
});

describe("Scan confirmation", () => {
  beforeEach(() => cy.window().then((w) => w.localStorage.removeItem("wc_selected_language")));

  it("shows the tree name after a scan, and can be dismissed", () => {
    mountApp({ pathname: "/trees/yellow-birch-1", state: { foundByScan: true } });
    cy.get('[data-cy="scan-confirmation"]').should("contain.text", "You found the Yellow birch.");
    cy.get('[data-cy="scan-confirmation"] [data-cy="gentle-message-dismiss"]').click();
    cy.get('[data-cy="scan-confirmation"]').should("not.exist");
  });

  it("is written in French when French is selected", () => {
    cy.window().then((w) => w.localStorage.setItem("wc_selected_language", "fr"));
    mountApp({ pathname: "/trees/yellow-birch-1", state: { foundByScan: true } });
    cy.get('[data-cy="scan-confirmation"]').should("contain.text", "Tu as trouvé cet arbre : Bouleau jaune.");
  });

  it("is not shown when the tree is opened without a scan", () => {
    mountApp("/trees/yellow-birch-1");
    cy.get('[data-cy="tree-name"]').should("exist");
    cy.get('[data-cy="scan-confirmation"]').should("not.exist");
  });
});
