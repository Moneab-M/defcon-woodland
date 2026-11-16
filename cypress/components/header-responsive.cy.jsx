/**
 * @file header-responsive.cy.jsx
 * @description Component tests that the site header (navi.jsx) stays visible, usable by
 * keyboard and free of sideways scrolling from 320 px up.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-22 | SRS: [ID 316], [ID 317]
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
const WIDTHS = [320, 768, 1024, 1050, 1280];
const LG_WIDTH = 1024; // Tailwind lg: links are inline from here up

/**
 * Purpose: Mount the header inside the providers it needs.
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

describe("Header on narrow screens (SCRUM-22)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  WIDTHS.forEach((width) => {
    it(`works at ${width} px`, () => {
      cy.viewport(width, 800);
      mountNavbar();

      cy.get("[data-cy=language-selector]").should("be.visible");
      cy.get('button[title="Light/Dark"]').should("be.visible");
      cy.document().then((doc) => {
        expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
      });

      if (width < LG_WIDTH) {
        cy.get("[data-cy=menu-button]").should("be.visible").and("have.attr", "aria-expanded", "false");
        cy.contains("header nav ul a", "Home").should("not.be.visible");
        cy.get("[data-cy=menu-button]").type("{enter}");
        cy.get("[data-cy=menu-button]").should("have.attr", "aria-expanded", "true");
        cy.contains("header nav ul a", "Natural Burial").should("be.visible");
        cy.get("[data-cy=language-option-fr]").focus().should("have.focus");
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
        });
      } else {
        cy.get("[data-cy=menu-button]").should("not.be.visible");
        cy.contains("header nav ul a", "Natural Burial").should("be.visible");
        cy.contains("header nav ul a", "Contact").should("be.visible");
      }
    });
  });
});
