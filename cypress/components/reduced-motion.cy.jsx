/**
 * @file reduced-motion.cy.jsx
 * @description Component tests: the Home slideshow has a pause/play button and
 * starts paused when the visitor prefers reduced motion; the global CSS rule exists.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-68 | SRS: WCAG 2.2.2, 2.3.3
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import Home from "../../src/pages/Home.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

// Purpose: index of the slide that is currently visible (opacity-100).
function activeSlide(win) {
  const imgs = Array.from(win.document.querySelectorAll("img.object-cover.absolute"));
  return imgs.findIndex((img) => img.classList.contains("opacity-100"));
}

// Purpose: stub matchMedia so the reduced-motion query answers `reduce`.
function stubMatchMedia(win, reduce) {
  cy.stub(win, "matchMedia").callsFake((q) => ({
    matches: /prefers-reduced-motion/.test(q) ? reduce : false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
}

describe("Reduced motion and slideshow pause control", () => {
  beforeEach(() => {
    window.localStorage.removeItem("wc_selected_language");
    window.speechSynthesis.getVoices = () => [];
  });

  it("advances by itself, pauses on request and plays again", () => {
    cy.clock();
    cy.window().then((win) => stubMatchMedia(win, false));
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Home />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.get("[data-cy=slideshow-toggle]").should("be.visible");
    cy.window().should((win) => expect(activeSlide(win)).to.eq(0));
    cy.wait(100);
    cy.tick(6000);
    cy.window().should((win) => expect(activeSlide(win)).to.eq(1));
    cy.get("[data-cy=slideshow-toggle]").should("contain", "Pause the pictures").click();
    cy.get("[data-cy=slideshow-toggle]").should("contain", "Play the pictures");
    cy.tick(20000);
    cy.window().should((win) => expect(activeSlide(win)).to.eq(1));
    cy.get("[data-cy=slideshow-toggle]").click();
    cy.tick(6000);
    cy.window().should((win) => expect(activeSlide(win)).to.eq(2));
  });

  it("starts paused when the visitor prefers reduced motion, and can still play", () => {
    cy.clock();
    cy.window().then((win) => stubMatchMedia(win, true));
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Home />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.get("[data-cy=slideshow-toggle]").should("contain", "Play the pictures");
    cy.tick(20000);
    cy.window().should((win) => expect(activeSlide(win)).to.eq(0));
    cy.get("[data-cy=slideshow-toggle]").click();
    cy.tick(6000);
    cy.window().should((win) => expect(activeSlide(win)).to.eq(1));
  });

  it("button is at least 44 px tall and labelled in French", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Home />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.get("[data-cy=slideshow-toggle]")
      .should("contain", "Mettre les images en pause")
      .invoke("outerHeight")
      .should("be.gte", 44);
  });

  it("the global stylesheet has the reduced-motion rule", () => {
    cy.readFile("src/index.css").then((css) => {
      expect(css).to.match(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\*,\s*\*::before,\s*\*::after/);
      expect(css).to.include("transition-duration: 0.001ms !important");
    });
  });
});
