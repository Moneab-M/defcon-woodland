/**
 * @file dialogs-keyboard.cy.jsx
 * @description Component tests: the Home and Natural Burial pop-ups are real
 * dialogs that open and close from the keyboard, and card images are buttons.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-67 | SRS: WCAG 2.1.1, 2.4.3, 4.1.2, 1.1.1
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import Home from "../../src/pages/Home.jsx";
import NaturalBurial from "../../src/pages/NaturalBurial.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

describe("Pop-up dialogs and keyboard cards", () => {
  beforeEach(() => {
    window.localStorage.removeItem("wc_selected_language");
    window.speechSynthesis.getVoices = () => [];
  });

  it("Home: Featured Species dialog opens and closes from the keyboard", () => {
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Home />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.contains("button", "Learn More").as("opener").focus().click();
    cy.get("[data-cy=featured-dialog]")
      .should("have.attr", "role", "dialog")
      .and("have.attr", "aria-modal", "true")
      .and("have.attr", "aria-labelledby", "featured-species-title");
    cy.get("#featured-species-title").should("not.be.empty");
    cy.focused().should("have.attr", "data-cy", "featured-dialog");
    cy.get("body").type("{esc}");
    cy.get("[data-cy=featured-dialog]").should("not.exist");
    cy.get("@opener").should("have.focus");
  });

  it("Natural Burial: card button opens the dialog, Close returns focus", () => {
    mount(<LanguageProvider><NaturalBurial /></LanguageProvider>);
    cy.get("[data-cy=card-image-button]").should("have.length", 3);
    cy.get("[data-cy=card-image-button]").first()
      .should("have.attr", "aria-label", "More about Types of Burial")
      .as("opener").focus().click();
    cy.get("[data-cy=burial-dialog]")
      .should("have.attr", "role", "dialog")
      .and("have.attr", "aria-modal", "true")
      .and("have.attr", "aria-labelledby", "natural-burial-dialog-title");
    cy.get("#natural-burial-dialog-title").should("contain.text", "Types of Natural Burial");
    cy.focused().should("have.attr", "data-cy", "burial-dialog");
    cy.contains("[data-cy=burial-dialog] button", "Close").focus().click();
    cy.get("[data-cy=burial-dialog]").should("not.exist");
    cy.get("@opener").should("have.focus");
  });

  it("Natural Burial: Escape closes the dialog and every card image has alt text", () => {
    mount(<LanguageProvider><NaturalBurial /></LanguageProvider>);
    cy.get(".card-image").should("have.length", 3).each(($img) => {
      expect($img.attr("alt")).to.be.a("string").and.not.be.empty;
    });
    cy.get("[data-cy=card-image-button]").eq(1).focus().click();
    cy.get("[data-cy=burial-dialog]").should("exist");
    cy.get("body").type("{esc}");
    cy.get("[data-cy=burial-dialog]").should("not.exist");
  });

  [false, true].forEach((dark) => {
    it(`Natural Burial: image buttons keep no card button styling (${dark ? "dark" : "light"})`, () => {
      document.documentElement.classList.toggle("dark", dark);
      mount(<LanguageProvider><NaturalBurial /></LanguageProvider>);
      cy.get("[data-cy=card-image-button]").should("have.length", 3).each(($btn) => {
        const btn = $btn[0];
        const cs = window.getComputedStyle(btn);
        expect(cs.backgroundColor).to.eq("rgba(0, 0, 0, 0)");
        expect(cs.padding).to.eq("0px");
        expect(cs.boxShadow).to.eq("none");
        const img = btn.querySelector("img");
        const imgWidth = img.getBoundingClientRect().width;
        expect(imgWidth).to.be.greaterThan(100);
        expect(Math.abs(btn.getBoundingClientRect().width - imgWidth)).to.be.at.most(1);
      }).then(() => {
        document.documentElement.classList.remove("dark");
      });
    });
  });
});
