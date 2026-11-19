/**
 * @file tree-character.cy.jsx
 * @description Component tests for the Talking Tree characters: each species,
 * English and French text alternative, allowed colours only, animation, and
 * the reduced-motion rule.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-56 | SRS: [ID 318], [ID 411], [ID 316]
 */

import React from "react";
import { mount } from "cypress/react";
import TreeCharacter from "../../src/Components/TreeCharacter.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import "../../src/index.css";

// ---------- Global constants ----------
const ALLOWED = ["none", "currentcolor", "#6b4f3a", "#8a6a4f", "#e8dcc8", "#c9b79c", "#c9a227", "#b9772e", "#5f7a8a", "#3e5566", "#eadfa8"];
const EN = { yellowBirch: "yellow birch", redSpruce: "red spruce", redMaple: "red maple", whitePine: "eastern white pine" };
const FR = { yellowBirch: "bouleau jaune", redSpruce: "épinette rouge", redMaple: "érable rouge", whitePine: "pin blanc" };

/** Purpose: Button so a test can change language without a reload. */
function FrenchButton() {
  const { setLanguage } = useLanguage();
  return <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>;
}

/** Purpose: Mount one character inside the language provider. */
function mountTree(props) {
  return mount(
    <LanguageProvider>
      <FrenchButton />
      <TreeCharacter {...props} />
    </LanguageProvider>
  );
}

describe("TreeCharacter (SCRUM-56)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  Object.keys(EN).forEach((species) => {
    it(`${species} renders with English and French text alternatives`, () => {
      mountTree({ species });
      cy.get(`[data-cy="tree-character-${species}"]`)
        .should("have.attr", "role", "img")
        .and("have.attr", "aria-label", `A friendly drawing of a tree: ${EN[species]}`);
      cy.get('[data-cy="tree-character-face"]').should("exist");
      cy.get('[data-cy="to-fr"]').click();
      cy.get(`[data-cy="tree-character-${species}"]`)
        .invoke("attr", "aria-label")
        .should("contain", FR[species]);
    });

    it(`${species} uses only palette colours or currentColor`, () => {
      mountTree({ species });
      cy.get(`[data-cy="tree-character-${species}"] *`).each(($el) => {
        ["fill", "stroke"].forEach((attr) => {
          const value = $el.attr(attr);
          if (value !== undefined) {
            expect(ALLOWED, `${attr} ${value}`).to.include(value.toLowerCase());
          }
        });
      });
    });
  });

  it("an unknown species renders nothing", () => {
    mountTree({ species: "oak" });
    cy.get("svg").should("not.exist");
  });

  it("when speaking the crown and mouth are animated, and eyes blink", () => {
    mountTree({ species: "redMaple", speaking: true });
    cy.get('[data-cy="tree-character-crown"]').then(($c) => {
      expect(getComputedStyle($c[0]).animationName).to.equal("tree-character-sway");
    });
    cy.get(".tree-character-mouth").then(($m) => {
      expect(getComputedStyle($m[0]).animationName).to.equal("tree-character-talk");
    });
    cy.get(".tree-character-eye").first().then(($e) => {
      expect(getComputedStyle($e[0]).animationName).to.equal("tree-character-blink");
    });
  });

  it("when not speaking the crown stays still", () => {
    mountTree({ species: "whitePine" });
    cy.get('[data-cy="tree-character-crown"]').then(($c) => {
      expect(getComputedStyle($c[0]).animationName).to.equal("none");
    });
  });

  it("the stylesheet turns every tree-character animation off for reduced motion", () => {
    // matchMedia stubs do not change CSS, so read the rule from the stylesheet itself.
    const offSelectors = [];
    Array.from(document.styleSheets).forEach((sheet) => {
      Array.from(sheet.cssRules).forEach((rule) => {
        if (rule.type === CSSRule.MEDIA_RULE && rule.conditionText.includes("prefers-reduced-motion: reduce")) {
          Array.from(rule.cssRules).forEach((inner) => {
            if (inner.selectorText && inner.selectorText.includes("tree-character-") && inner.style.animationName === "none") {
              offSelectors.push(inner.selectorText);
            }
          });
        }
      });
    });
    const joined = offSelectors.join(" ");
    [".tree-character-crown", ".tree-character-mouth", ".tree-character-eye"].forEach((cls) => {
      expect(joined, cls).to.include(cls);
    });
    expect(joined).to.include(".tree-character-speaking .tree-character-crown");
    expect(joined).to.include(".tree-character-speaking .tree-character-mouth");
  });
});
