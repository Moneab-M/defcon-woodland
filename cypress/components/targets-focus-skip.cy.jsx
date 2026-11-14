/**
 * @file targets-focus-skip.cy.jsx
 * @description Component tests: header controls, settings button and footer links are
 * at least 44 by 44 px; the skip link is the first tab stop and moves focus to the main content.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-69 | SRS: WCAG 2.4.1, 2.4.7, 2.5.5
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 * - React Router MemoryRouter: https://reactrouter.com
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

// ---------- Global constants ----------
const MIN_SIZE = 44;
const WIDTHS = [1280, 375];
const TARGETS = [
  "[data-cy=language-option-en]",
  "[data-cy=language-option-fr]",
  "button[title='Light/Dark']",
  "[data-cy=settings-button]",
  "[data-cy=footer-facebook]",
  "[data-cy=footer-instagram]",
  "[data-cy=footer-youtube]",
];

// Purpose: mount the whole App on the home page.
function mountApp() {
  window.speechSynthesis.getVoices = () => [];
  mount(
    <MemoryRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Touch targets (SCRUM-69)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  WIDTHS.forEach((width) => {
    it(`every listed control is at least 44 px at ${width} px`, () => {
      cy.viewport(width, 800);
      mountApp();
      TARGETS.forEach((selector) => {
        cy.get(selector).then(($el) => {
          const rect = $el[0].getBoundingClientRect();
          expect(rect.width, `${selector} width`).to.be.at.least(MIN_SIZE);
          expect(rect.height, `${selector} height`).to.be.at.least(MIN_SIZE);
        });
      });
    });
  });
});

describe("Skip link (SCRUM-69)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("is the first focusable element, is visible on focus and focuses the main content", () => {
    mountApp();
    cy.get("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])")
      .first()
      .should("have.attr", "data-cy", "skip-link");
    cy.get("[data-cy=skip-link]").should("have.text", "Skip to the main content").focus();
    cy.get("[data-cy=skip-link]").should("be.visible");
    cy.get("[data-cy=skip-link]").click();
    cy.get("#main-content").should("have.focus");
  });

  it("shows French text", () => {
    mountApp();
    cy.get("[data-cy=language-option-fr]").click();
    cy.get("[data-cy=skip-link]").should("have.text", "Passer au contenu principal");
  });
});

describe("Focus outline (SCRUM-69)", () => {
  const FOCUS_TARGETS = [
    "[data-cy=language-option-fr]",
    "button[title='Light/Dark']",
    "[data-cy=skip-link]",
  ];

  // Purpose: focus an element as a keyboard user would, so :focus-visible matches.
  function focusByKeyboard(selector) {
    cy.document().then((doc) => {
      doc.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    });
    cy.get(selector).focus();
  }

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  FOCUS_TARGETS.forEach((selector) => {
    it(`${selector} shows a solid 3 px outline when focused`, () => {
      mountApp();
      cy.document().then((doc) => doc.documentElement.classList.remove("dark"));
      focusByKeyboard(selector);
      cy.get(selector).should("have.css", "outline-style", "solid");
      cy.get(selector).should("have.css", "outline-width", "3px");
      cy.get(selector).should("have.css", "outline-color", "rgb(37, 99, 235)");
    });
  });

  it("uses the pale blue outline in dark mode", () => {
    mountApp();
    cy.document().then((doc) => doc.documentElement.classList.add("dark"));
    focusByKeyboard("[data-cy=language-option-fr]");
    cy.get("[data-cy=language-option-fr]").should("have.css", "outline-color", "rgb(147, 197, 253)");
  });
});
