/**
 * @file contact-text.cy.jsx
 * @description Component tests for the Contact page text in English and French.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-50 | SRS: [ID 101]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import Contact from "../../src/pages/Contact.jsx";
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
      <Contact />
    </LanguageProvider>
  );
}

describe("Contact page text", () => {
  beforeEach(() => {
    window.localStorage.removeItem("wc_selected_language");
  });

  it("shows English heading, button and select option", () => {
    mountPage();
    cy.contains("h1", "Contact & Inquiry Form").should("exist");
    cy.contains("button", "Send OTP").should("exist");
    cy.contains("button", "Submit Inquiry").should("exist");
    cy.get('select[name="inquiryType"] option').first().should("have.text", "Select an option");
  });

  it("shows French heading, button and select option when French is selected", () => {
    window.localStorage.setItem("wc_selected_language", "fr");
    mountPage();
    cy.contains("h1", "Formulaire de contact et de demande").should("exist");
    cy.contains("button", "Envoyer le code").should("exist");
    cy.contains("button", "Envoyer la demande").should("exist");
    cy.get('select[name="inquiryType"] option').first().should("have.text", "Choisir une option");
  });

  it("switches language and error text without a reload or losing typed text", () => {
    mountPage();
    cy.get('input[name="fullName"]').type("Sam Smith");
    cy.contains("button", "Submit Inquiry").click();
    cy.contains("Email is required.").should("exist");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.contains("h1", "Formulaire de contact et de demande").should("exist");
    cy.contains("L'adresse courriel est obligatoire.").should("exist");
    cy.get('input[name="fullName"]').should("have.value", "Sam Smith");
  });
});
