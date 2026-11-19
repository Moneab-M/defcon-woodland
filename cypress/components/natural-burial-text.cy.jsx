/**
 * @file natural-burial-text.cy.jsx
 * @description Component tests for the Natural Burial page text in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-49 | SRS: [ID 101]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import NaturalBurial from "../../src/pages/NaturalBurial.jsx";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/**
 * Purpose: Mount the page with the Language Selector beside it.
 *
 * Returns: the Cypress mount chain
 */
function mountPage() {
  return mount(
    <LanguageProvider>
      <LanguageSelector />
      <NaturalBurial />
    </LanguageProvider>
  );
}

describe("Natural Burial page text", () => {
  beforeEach(() => {
    window.localStorage.removeItem("wc_selected_language");
    window.speechSynthesis.getVoices = () => [];
  });

  it("shows English text, alt text and aria-label", () => {
    mountPage();
    cy.contains("h2", "Description of Natural burial").should("exist");
    cy.contains("button", "Learn more").should("exist");
    cy.get('img[alt="A wooden heart-shaped grave marker"]').should("exist");
    cy.get('button[aria-label="Read description out loud"]').should("exist");
  });

  it("shows French text, alt text and aria-label when French is selected", () => {
    window.localStorage.setItem("wc_selected_language", "fr");
    mountPage();
    cy.contains("h2", "Qu'est-ce que l'inhumation naturelle ?").should("exist");
    cy.contains("button", "En savoir plus").should("exist");
    cy.get('img[alt="Un marqueur de tombe en bois en forme de cœur"]').should("exist");
    cy.get('button[aria-label="Lire la description à voix haute"]').should("exist");
  });

  it("switches language without a reload", () => {
    mountPage();
    cy.contains("h2", "Description of Natural burial").should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("h2", "Qu'est-ce que l'inhumation naturelle ?").should("exist");
    cy.contains("button", "En savoir plus").first().click();
    cy.get(".modal-content h2").should("have.text", "Types d'inhumation naturelle");
    cy.contains("button", "Fermer").should("exist");
  });

  it("reads the description aloud in French when French is selected", () => {
    window.localStorage.setItem("wc_selected_language", "fr");
    cy.stub(window.speechSynthesis, "speak").as("speak");
    mountPage();
    cy.get('button[aria-label="Lire la description \u00e0 voix haute"]').click();
    cy.get("@speak").should("have.been.calledOnce");
    cy.get("@speak")
      .its("firstCall.args.0.text")
      .should("contain", "L'inhumation naturelle est une fa\u00e7on");
    cy.get("@speak").its("firstCall.args.0.lang").should("eq", "fr-CA");
  });

  it("reads the description aloud in English by default", () => {
    cy.stub(window.speechSynthesis, "speak").as("speak");
    mountPage();
    cy.get('button[aria-label="Read description out loud"]').click();
    cy.get("@speak")
      .its("firstCall.args.0.text")
      .should("contain", "Natural burial is an eco-friendly alternative");
    cy.get("@speak").its("firstCall.args.0.lang").should("eq", "en-CA");
  });
});
