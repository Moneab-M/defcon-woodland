/**
 * @file tree-milestones.cy.jsx
 * @description Component tests for found trees, the first-tree and all-trees
 * celebrations, the found markers in the list and "Start again".
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-76 | SRS: Talking Tree, [ID 316], [ID 317]
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";
import { getFoundTrees, markTreeFound, resetFoundTrees } from "../../src/talkingTrees/foundTrees.js";

const IDS = ["yellow-birch-1", "red-spruce-1", "red-maple-1", "white-pine-1"];

/** Purpose: Mount the real App at a path, optionally as if reached by scanning. */
function mountApp(path, scanned = false) {
  const entry = scanned ? { pathname: path, state: { foundByScan: true } } : path;
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

describe("Found trees", () => {
  beforeEach(() => {
    cy.window().then((w) => {
      w.localStorage.removeItem("wca_found_trees");
      w.localStorage.removeItem("wc_selected_language");
    });
    cy.then(() => resetFoundTrees());
  });

  it("celebrates the first tree and stores only the ID list", () => {
    mountApp("/trees/yellow-birch-1", true);
    cy.get('[data-cy="milestone-first"]').should("contain.text", "Your first talking tree");
    cy.get('[data-cy="milestone-all"]').should("not.exist");
    cy.window().then((w) => expect(w.localStorage.getItem("wca_found_trees")).to.equal('["yellow-birch-1"]'));
  });

  it("does not celebrate again on a revisit", () => {
    mountApp("/trees/yellow-birch-1", true);
    cy.get('[data-cy="milestone-first"]').should("exist");
    mountApp("/trees/yellow-birch-1", true);
    cy.get('[data-cy="scan-confirmation"]').should("exist");
    cy.get('[data-cy="milestone-first"]').should("not.exist");
  });

  it("stores nothing when the tree is not reached by scanning", () => {
    mountApp("/trees/yellow-birch-1");
    cy.get('[data-cy="tree-name"]').should("exist");
    cy.get('[data-cy="milestone"]').should("not.exist");
    cy.window().then((w) => expect(w.localStorage.getItem("wca_found_trees")).to.equal(null));
  });

  it("celebrates once when all four trees are found", () => {
    IDS.slice(0, 3).forEach((id) => markTreeFound(id));
    mountApp("/trees/white-pine-1", true);
    cy.get('[data-cy="milestone-all"]').should("contain.text", "every talking tree");
    cy.get('[data-cy="milestone-first"]').should("not.exist");
    cy.window().then((w) => expect(JSON.parse(w.localStorage.getItem("wca_found_trees"))).to.have.length(4));
  });

  it("marks found trees with a word and the count, in English and French", () => {
    markTreeFound("red-spruce-1");
    mountApp("/trees");
    cy.get('[data-cy="tree-found-red-spruce-1"]').should("contain.text", "Found");
    cy.get('[data-cy="tree-found-red-spruce-1"] svg[aria-hidden="true"]').should("exist");
    cy.get('[data-cy="tree-found-yellow-birch-1"]').should("not.exist");
    cy.get('[data-cy="found-count"]').should("have.text", "You have met 1 of 4 trees.");
    cy.get('[data-cy="language-option-fr"]').click();
    cy.get('[data-cy="tree-found-red-spruce-1"]').should("contain.text", "Trouvé");
    cy.get('[data-cy="found-count"]').should("have.text", "Tu as rencontré 1 sur 4 arbres.");
  });

  it("shows no count or reset button before any tree is found", () => {
    mountApp("/trees");
    cy.get('[data-cy="found-count"]').should("not.exist");
    cy.get('[data-cy="reset-found-trees"]').should("not.exist");
  });

  it("Start again clears the stored list and the markers", () => {
    markTreeFound("red-spruce-1");
    mountApp("/trees");
    cy.get('[data-cy="reset-found-trees"]').should("have.text", "Start again").click();
    cy.get('[data-cy="tree-found-red-spruce-1"]').should("not.exist");
    cy.get('[data-cy="reset-found-trees"]').should("not.exist");
    cy.window().then((w) => expect(w.localStorage.getItem("wca_found_trees")).to.equal(null));
  });

  it("still works when storage is blocked", () => {
    cy.window().then((w) => {
      // Only the found-trees key is blocked; older site code (theme, language) is not part of this ticket.
      const realSetItem = w.Storage.prototype.setItem;
      cy.stub(w.Storage.prototype, "setItem").callsFake(function (key, value) {
        if (key === "wca_found_trees") throw new Error("blocked");
        return realSetItem.call(this, key, value);
      });
    });
    mountApp("/trees/yellow-birch-1", true);
    cy.get('[data-cy="tree-name"]').should("exist");
    cy.get('[data-cy="milestone-first"]').should("exist");
  });
});

describe("getFoundTrees", () => {
  beforeEach(() => {
    cy.window().then((w) => w.localStorage.removeItem("wca_found_trees"));
    cy.then(() => resetFoundTrees());
  });

  it("returns [] for corrupt JSON", () => {
    cy.window().then((w) => {
      w.localStorage.setItem("wca_found_trees", "{not json");
      expect(getFoundTrees()).to.deep.equal([]);
    });
  });

  it("drops unknown IDs and non-arrays", () => {
    cy.window().then((w) => {
      w.localStorage.setItem("wca_found_trees", '["red-maple-1","nope",5]');
      expect(getFoundTrees()).to.deep.equal(["red-maple-1"]);
      w.localStorage.setItem("wca_found_trees", '{"a":1}');
      expect(getFoundTrees()).to.deep.equal([]);
    });
  });
});
