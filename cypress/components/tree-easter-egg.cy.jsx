/**
 * @file tree-easter-egg.cy.jsx
 * @description Component tests for the knot-hole easter egg on the tree page:
 * real button, size, labels, keyboard, line in both languages, no sound, nothing
 * blocked, reduced-motion rule and allowed colours.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-78 | SRS: Talking Tree, [ID 316], [ID 317]
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";
import "../../src/index.css";

// ---------- Global constants ----------
const ALLOWED = ["#6b4f3a", "#8a6a4f", "#e8dcc8", "#c9b79c", "#c9a227", "#b9772e", "#5f7a8a", "#3e5566", "#eadfa8", "#000000", "#ffffff", "#d9d4c7", "currentcolor", "none"];
// Fill of the trunk shape the knot-hole sits on, per species (must differ from the knot-hole fill)
const TRUNK_FILL = { "yellow-birch-1": "#e8dcc8", "red-spruce-1": "#6b4f3a", "red-maple-1": "#8a6a4f", "white-pine-1": "#8a6a4f" };

/** Purpose: Mount the real App at a tree page. */
function mountTree(id = "yellow-birch-1") {
  mount(
    <MemoryRouter initialEntries={[`/trees/${id}`]}>
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <App />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

/** Purpose: Turn "rgb(r, g, b)" into lower-case hex. */
function toHex(rgb) {
  const m = rgb.match(/\d+/g);
  if (!m) return rgb.toLowerCase();
  return "#" + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
}

describe("Knot-hole easter egg (SCRUM-78)", () => {
  beforeEach(() => {
    cy.window().then((w) => {
      w.localStorage.removeItem("wc_selected_language");
      cy.stub(w.HTMLMediaElement.prototype, "play").as("play").returns(Promise.resolve());
    });
  });

  it("is a real, large, labelled button", () => {
    mountTree();
    cy.get('[data-cy="tree-knot-hole"]')
      .should("have.prop", "tagName", "BUTTON")
      .and("have.attr", "type", "button")
      .and("have.attr", "aria-label", "Look inside the knot-hole")
      .and("have.attr", "aria-expanded", "false")
      .then(($b) => {
        const r = $b[0].getBoundingClientRect();
        expect(r.width).to.be.at.least(44);
        expect(r.height).to.be.at.least(44);
      });
  });

  // Note: Cypress cannot send a trusted Enter or Space key press. On a native <button> the browser
  // turns Enter and Space into a click, so these tests prove the button is focusable (keyboard
  // reachable) and then activate it with a click.
  it("is keyboard reachable and shows the line, then hides it again, in English", () => {
    mountTree();
    cy.get('[data-cy="knot-hole-line"]').should("have.attr", "role", "status").and("have.text", "");
    cy.get('[data-cy="tree-knot-hole"]').should("not.have.attr", "tabindex", "-1").focus();
    cy.focused().should("have.attr", "data-cy", "tree-knot-hole");
    cy.focused().click();
    cy.get('[data-cy="tree-knot-hole"]').should("have.attr", "aria-expanded", "true");
    cy.get('[data-cy="knot-hole-line"]').should("have.text", "Chick-a-dee-dee-dee. A chickadee was resting in here.");
    cy.get('[data-cy="tree-egg-bird"]').should("exist");
    cy.get('[data-cy="tree-knot-hole"]').click();
    cy.get('[data-cy="tree-knot-hole"]').should("have.attr", "aria-expanded", "false");
    cy.get('[data-cy="knot-hole-line"]').should("have.text", "");
    cy.get('[data-cy="tree-egg-bird"]').should("not.exist");
  });

  it("shows the label and the line in French", () => {
    cy.window().then((w) => w.localStorage.setItem("wc_selected_language", "fr"));
    mountTree();
    cy.get('[data-cy="tree-knot-hole"]').should("have.attr", "aria-label", "Regarder dans le trou du tronc");
    cy.get('[data-cy="tree-knot-hole"]').focus().click();
    cy.get('[data-cy="knot-hole-line"]').should("have.text", "Tchic-a-di-di-di. Une mésange se reposait ici.");
  });

  ["red-spruce-1", "red-maple-1", "white-pine-1"].forEach((id) => {
    it(`works for ${id}`, () => {
      mountTree(id);
      cy.get('[data-cy="tree-knot-hole"]').click();
      cy.get('[data-cy="knot-hole-line"]').should("not.have.text", "");
      cy.get('[data-cy="tree-egg-bird"]').should("exist");
    });
  });

  it("plays no sound and never blocks the audio button or facts", () => {
    mountTree();
    cy.get('[data-cy="tree-knot-hole"]').click();
    cy.get("@play").should("not.have.been.called");
    cy.get('[data-cy="tree-facts"]').should("be.visible");
    cy.get('[data-cy="tree-facts"] li').first().should("be.visible");
    cy.get('[data-cy="tree-audio-button"]').should("be.visible").then(($a) => {
      const r = $a[0].getBoundingClientRect();
      const top = $a[0].ownerDocument.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      expect($a[0].contains(top)).to.equal(true);
    });
    cy.get('[data-cy="tree-audio-button"]').should("not.be.disabled");
  });

  it("has a reduced-motion rule for tree-egg- and uses allowed colours only", () => {
    mountTree();
    cy.get('[data-cy="tree-knot-hole"]').click();
    cy.document().then((doc) => {
      let found = false;
      Array.from(doc.styleSheets).forEach((sheet) => {
        let rules = [];
        try { rules = Array.from(sheet.cssRules); } catch (e) { /* cross-origin sheet */ }
        rules.forEach((rule) => {
          if (rule.type === CSSRule.MEDIA_RULE && /prefers-reduced-motion:\s*reduce/.test(rule.conditionText)) {
            Array.from(rule.cssRules).forEach((r) => { if (r.selectorText && r.selectorText.includes("tree-egg-")) found = true; });
          }
        });
      });
      expect(found, "reduced-motion rule for tree-egg-").to.equal(true);
    });
    cy.get('[data-cy="tree-knot-drawing"] [fill]').each(($el) => {
      const v = toHex(getComputedStyle($el[0]).fill);
      expect(ALLOWED, `fill ${v}`).to.include(v);
    });
    cy.get('[data-cy="tree-knot-drawing"] [stroke]').each(($el) => {
      const v = $el.attr("stroke").toLowerCase();
      expect(ALLOWED, `stroke ${v}`).to.include(v);
    });
  });

  Object.keys(TRUNK_FILL).forEach((id) => {
    it(`knot-hole fill differs from the trunk fill and has a ring (${id})`, () => {
      mountTree(id);
      cy.get('[data-cy="tree-knot-drawing"] ellipse').first().then(($k) => {
        expect(toHex(getComputedStyle($k[0]).fill)).to.not.equal(TRUNK_FILL[id]);
        expect($k.attr("stroke")).to.equal("currentColor");
      });
    });
  });
});
