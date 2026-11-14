/**
 * @file tree-audio.cy.jsx
 * @description Component tests for the Talking Tree audio, captions and transcript,
 * and the getTreeAudio lookup.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-57 | SRS: Talking Tree, [ID 103], [ID 307]
 */

import React from "react";
import { mount } from "cypress/react";
import TreeAudio from "../../src/Components/TreeAudio.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";
import { TALKING_TREES } from "../../src/talkingTrees/trees.js";
import { getTreeAudio, TREE_AUDIO } from "../../src/talkingTrees/treeAudio.js";
import en from "../../src/i18n/en.js";
import fr from "../../src/i18n/fr.js";

const tree = TALKING_TREES[0];

/** Purpose: Button so a test can change language without a reload. */
function FrenchButton() {
  const { setLanguage } = useLanguage();
  return <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>;
}

/** Purpose: Mount the component inside the providers it needs. */
function mountTree(props = {}) {
  return mount(
    <LanguageProvider>
      <PrerecordedAudioProvider>
        <FrenchButton />
        <TreeAudio tree={tree} {...props} />
      </PrerecordedAudioProvider>
    </LanguageProvider>
  );
}

describe("getTreeAudio", () => {
  it("returns null when not recorded, for mic and for unknown trees", () => {
    TALKING_TREES.forEach((t) => {
      expect(getTreeAudio(t.id, "en")).to.equal(null);
      expect(getTreeAudio(t.id, "fr")).to.equal(null);
      expect(getTreeAudio(t.id, "mic")).to.equal(null);
      expect(TREE_AUDIO[t.id]).to.not.have.property("mic");
    });
    expect(getTreeAudio("no-such-tree", "en")).to.equal(null);
    expect(getTreeAudio("__proto__", "en")).to.equal(null);
  });
});

describe("Tree audio (SCRUM-57)", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem("wc_selected_language");
      // Fake Audio: records play/pause, supports on* handlers and dispatchEvent
      win.__played = [];
      win.__playResult = null;
      class FakeAudio extends EventTarget {
        constructor() {
          super();
          this.src = "";
          this.currentTime = 0;
          win.__fakeAudio = this;
        }
        play() {
          win.__played.push(this.src);
          return win.__playResult ? win.__playResult() : Promise.resolve();
        }
        pause() {}
        dispatchEvent(event) {
          const handler = this["on" + event.type];
          if (typeof handler === "function") handler.call(this, event);
          return super.dispatchEvent(event);
        }
      }
      cy.stub(win, "Audio").callsFake(() => new FakeAudio());
      if (win.speechSynthesis) cy.stub(win.speechSynthesis, "speak").as("speak");
      else cy.wrap(null).as("speak");
    });
  });

  it("shows the notice and never plays when there is no recording", () => {
    mountTree();
    cy.get("[data-cy=tree-audio-unavailable]").should("contain.text", en.trees.audio.unavailable);
    cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-pressed", "false").click();
    cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-pressed", "false");
    cy.window().then((win) => {
      expect(win.__played).to.have.length(0);
    });
    cy.get("@speak").then((speak) => {
      if (speak) expect(speak).to.not.have.been.called;
    });
  });

  it("no recording: button is aria-disabled, focusable, described by the notice and announces it on activation", () => {
    mountTree();
    cy.get("[data-cy=tree-audio-unavailable]").invoke("attr", "id").then((noticeId) => {
      cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-disabled", "true");
      cy.get("[data-cy=tree-audio-button]").should("not.have.attr", "disabled");
      cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-describedby", noticeId);
    });
    cy.get("[data-cy=tree-audio-status]").should("have.attr", "role", "status").and("have.text", "");
    cy.get("[data-cy=tree-audio-button]").focus().should("have.focus");
    cy.get("[data-cy=tree-audio-button]").click();
    cy.get("[data-cy=tree-audio-status]").should("contain.text", en.trees.audio.unavailable);
    cy.get("[data-cy=tree-audio-button]").should("have.focus");
    cy.window().then((win) => {
      expect(win.__played).to.have.length(0);
    });
  });

  it("button is at least 44 px and labelled in both languages", () => {
    mountTree();
    cy.get("[data-cy=tree-audio-button]").should("contain.text", en.trees.audio.play)
      .invoke("outerHeight").should("be.gte", 44);
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=tree-audio-button]").should("contain.text", fr.trees.audio.play);
  });

  it("transcript shows the greeting and facts in English and French", () => {
    mountTree();
    cy.get("[data-cy=tree-transcript]").should("not.have.attr", "open");
    cy.get("[data-cy=tree-transcript] summary").click();
    cy.get("[data-cy=tree-transcript]").should("have.attr", "open");
    const enTree = en.trees.species[tree.species];
    cy.get("[data-cy=tree-transcript-line]").should("have.length", 1 + enTree.facts.length);
    cy.get("[data-cy=tree-transcript-line]").first().should("have.text", enTree.greeting);
    cy.get("[data-cy=tree-transcript-line]").last().should("have.text", enTree.facts[enTree.facts.length - 1]);
    cy.get("[data-cy=to-fr]").click();
    const frTree = fr.trees.species[tree.species];
    cy.get("[data-cy=tree-transcript-line]").first().should("have.text", frTree.greeting);
    cy.get("[data-cy=tree-transcript-line]").last().should("have.text", frTree.facts[frTree.facts.length - 1]);
  });

  it("plays, reports speaking, stops on a second click and resets on ended", () => {
    const onSpeakingChange = cy.stub().as("speaking");
    mountTree({ audioOverride: { src: "/audio/trees/test_en.mp3", cues: null }, onSpeakingChange });
    cy.get("[data-cy=tree-audio-unavailable]").should("not.exist");
    cy.get("[data-cy=tree-audio-button]").click().should("have.attr", "aria-pressed", "true");
    cy.window().then((win) => {
      expect(win.__played[0]).to.match(/\/audio\/trees\/test_en\.mp3$/);
    });
    cy.get("@speaking").should("have.been.calledWith", true);
    // No cues: the whole text is shown while playing
    cy.get("[data-cy=tree-captions] p").should("have.length", 1 + en.trees.species[tree.species].facts.length);
    cy.get("[data-cy=tree-audio-button]").click().should("have.attr", "aria-pressed", "false");
    cy.get("[data-cy=tree-captions]").should("not.exist");
    cy.get("[data-cy=tree-audio-button]").click().should("have.attr", "aria-pressed", "true");
    cy.window().then((win) => win.__fakeAudio.dispatchEvent(new win.Event("ended")));
    cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-pressed", "false");
    cy.get("@speaking").should("have.been.calledWith", false);
    cy.get("@speak").then((speak) => {
      if (speak) expect(speak).to.not.have.been.called;
    });
  });

  it("shows the notice when play() is rejected", () => {
    cy.window().then((win) => {
      win.__playResult = () => Promise.reject(new Error("blocked"));
    });
    mountTree({ audioOverride: { src: "/audio/trees/test_en.mp3", cues: null } });
    cy.get("[data-cy=tree-audio-button]").click();
    cy.get("[data-cy=tree-audio-unavailable]").should("be.visible");
    cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-pressed", "false");
  });

  it("marks the line being spoken from the cues on timeupdate", () => {
    const cues = [
      { start: 0, end: 2, line: 0 },
      { start: 2, end: 5, line: 1 },
    ];
    mountTree({ audioOverride: { src: "/audio/trees/test_en.mp3", cues } });
    cy.get("[data-cy=tree-audio-button]").click();
    const enTree = en.trees.species[tree.species];
    cy.window().then((win) => {
      win.__fakeAudio.currentTime = 1;
      win.__fakeAudio.dispatchEvent(new win.Event("timeupdate"));
    });
    cy.get("[data-cy=tree-captions] [aria-current=true]").should("have.text", enTree.greeting);
    cy.window().then((win) => {
      win.__fakeAudio.currentTime = 3;
      win.__fakeAudio.dispatchEvent(new win.Event("timeupdate"));
    });
    cy.get("[data-cy=tree-captions] [aria-current=true]").should("have.text", enTree.facts[0]);
  });

  it("stops playback when the language changes", () => {
    mountTree({ audioOverride: { src: "/audio/trees/test_en.mp3", cues: null } });
    cy.get("[data-cy=tree-audio-button]").click().should("have.attr", "aria-pressed", "true");
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=tree-audio-button]").should("have.attr", "aria-pressed", "false");
  });
});
