/**
 * @file image-audio-button.cy.jsx
 * @description Component tests for the Image Audio Button and the shared Prerecorded Audio Player.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-9, SCRUM-11 | SRS: [ID 103], [ID 307], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import ImageAudioButton from "../../src/Components/ImageAudioButton.jsx";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import { getImageAudioSrc } from "../../src/audio/imageAudio.js";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

/**
 * Purpose: Mount two Image Audio Buttons inside the providers.
 *
 * Parameters:
 * - onUnavailable: optional function passed to the first button
 *
 * Returns: the Cypress mount chain
 */
function mountButtons(onUnavailable) {
  return mount(
    <LanguageProvider>
      <PrerecordedAudioProvider>
        <ImageAudioButton imageId="one" src="/audio/one.mp3" onUnavailable={onUnavailable} />
        <ImageAudioButton imageId="two" src="/audio/two.mp3" />
      </PrerecordedAudioProvider>
    </LanguageProvider>
  );
}

describe("Image Audio Button", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem("wc_selected_language");
      // No real audio or network: replace Audio with a fake that records play/pause
      const played = [];
      class FakeAudio {
        constructor() {
          this.src = "";
          this.onended = null;
          this.onerror = null;
          win.__fakeAudio = this;
        }
        play() {
          played.push(this.src);
          return win.__playResult ? win.__playResult() : Promise.resolve();
        }
        pause() {
          win.__paused = (win.__paused || 0) + 1;
        }
      }
      win.__playResult = null;
      win.__paused = 0;
      win.__played = played;
      cy.stub(win, "Audio").callsFake(() => new FakeAudio());
    });
  });

  it("plays on click, then stops on a second click", () => {
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]')
      .should("have.attr", "aria-pressed", "false")
      .and("contain.text", "Play image description")
      .click()
      .should("have.attr", "aria-pressed", "true")
      .and("contain.text", "Stop image description");
    cy.window().its("__played").should("deep.equal", ["/audio/one.mp3"]);
    cy.get('[data-cy="image-audio-button-one"]')
      .click()
      .should("have.attr", "aria-pressed", "false")
      .and("contain.text", "Play image description");
    cy.window().its("__paused").should("be.gte", 1);
  });

  it("starting a second button stops the first", () => {
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').click();
    cy.get('[data-cy="image-audio-button-two"]').click();
    cy.get('[data-cy="image-audio-button-one"]').should("have.attr", "aria-pressed", "false");
    cy.get('[data-cy="image-audio-button-two"]').should("have.attr", "aria-pressed", "true");
  });

  it("returns to not playing when the recording ends", () => {
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').click().should("have.attr", "aria-pressed", "true");
    cy.window().then((win) => {
      win.__fakeAudio.onended();
    });
    cy.get('[data-cy="image-audio-button-one"]').should("have.attr", "aria-pressed", "false");
  });

  it("calls onUnavailable when the recording cannot play", () => {
    cy.window().then((win) => {
      win.__playResult = () => Promise.reject(new Error("blocked"));
    });
    const onUnavailable = cy.stub().as("onUnavailable");
    mountButtons(onUnavailable);
    cy.get('[data-cy="image-audio-button-one"]').click();
    cy.get("@onUnavailable").should("have.been.calledOnce");
    cy.get('[data-cy="image-audio-button-one"]').should("have.attr", "aria-pressed", "false");
  });

  it("shows a notice (no text-to-speech) when play() fails, in English", () => {
    cy.window().then((win) => {
      win.__playResult = () => Promise.reject(new Error("missing"));
      win.speechSynthesis.speak = cy.stub().as("speak");
    });
    mountButtons();
    cy.get('[data-cy="image-audio-unavailable-one"]').should("not.exist");
    cy.get('[data-cy="image-audio-button-one"]').click();
    cy.get('[data-cy="image-audio-unavailable-one"]')
      .should("be.visible")
      .and("have.attr", "role", "status")
      .and("contain.text", "This picture's audio description is not ready yet.");
    cy.get('[data-cy="image-audio-button-one"]').should("have.attr", "aria-pressed", "false");
    cy.get("@speak").should("not.have.been.called");
  });

  it("shows the notice on an error event, in French, and clears it on the next click", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("wc_selected_language", "fr");
      win.speechSynthesis.speak = cy.stub().as("speak");
    });
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').click().should("have.attr", "aria-pressed", "true");
    cy.window().then((win) => {
      win.__fakeAudio.onerror();
    });
    cy.get('[data-cy="image-audio-unavailable-one"]')
      .should("contain.text", "La description audio de cette image n'est pas encore prête.");
    cy.get('[data-cy="image-audio-button-one"]').should("have.attr", "aria-pressed", "false");
    cy.get("@speak").should("not.have.been.called");
    cy.get('[data-cy="image-audio-button-two"]').click();
    cy.get('[data-cy="image-audio-unavailable-one"]').should("not.exist");
  });

  it("shows no notice after a successful play and when it ends", () => {
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').click();
    cy.get('[data-cy="image-audio-unavailable-one"]').should("not.exist");
    cy.window().then((win) => {
      win.__fakeAudio.onended();
    });
    cy.get('[data-cy="image-audio-button-one"]').should("have.attr", "aria-pressed", "false");
    cy.get('[data-cy="image-audio-unavailable-one"]').should("not.exist");
  });

  it("can be reached by keyboard and is a native button", () => {
    // Cypress sends Enter on a button as a click that does not bubble to React, so
    // we check the browser's own keyboard behaviour is available instead:
    // a focusable <button type="button"> is activated by Enter and Space natively.
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]')
      .focus()
      .should("have.focus")
      .and("match", "button[type=button]")
      .and("not.have.attr", "tabindex");
  });

  it("is at least 44 px high", () => {
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').invoke("outerHeight").should("be.gte", 44);
  });

  it("shows French labels", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').should("contain.text", "Écouter la description de l'image");
  });

  // ---------- SCRUM-11: language-aware lookup ----------

  /** Purpose: Mount buttons that use the language lookup, plus a switcher button. */
  function mountLookup(imageId = "about") {
    function Switcher() {
      const { setLanguage } = useLanguage();
      return (
        <>
          <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>
          <button data-cy="to-mic" onClick={() => setLanguage("mic")}>mic</button>
        </>
      );
    }
    return mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Switcher />
          <ImageAudioButton imageId={imageId} />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
  }

  it("plays the English file when English is selected", () => {
    mountLookup();
    cy.get('[data-cy="image-audio-button-about"]').click();
    cy.window().its("__fakeAudio.src").should("match", /\/audio\/images\/about_en\.mp3$/);
  });

  it("plays the French file when French is selected", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    mountLookup();
    cy.get('[data-cy="image-audio-button-about"]').click();
    cy.window().its("__fakeAudio.src").should("match", /\/audio\/images\/about_fr\.mp3$/);
  });

  it("plays nothing and shows the notice for Mi'kmaq", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("wc_selected_language", "mic");
      win.speechSynthesis.speak = cy.stub().as("speak");
    });
    mountLookup();
    cy.get('[data-cy="image-audio-button-about"]').click().should("have.attr", "aria-pressed", "false");
    cy.get('[data-cy="image-audio-unavailable-about"]').should("be.visible");
    cy.window().its("__played").should("have.length", 0);
    cy.get("@speak").should("not.have.been.called");
  });

  it("shows the notice for an image that is not in the manifest", () => {
    mountLookup("unknown");
    cy.get('[data-cy="image-audio-button-unknown"]').click();
    cy.get('[data-cy="image-audio-unavailable-unknown"]').should("be.visible");
    cy.window().its("__played").should("have.length", 0);
  });

  it("stops playback when the language changes", () => {
    mountLookup();
    cy.get('[data-cy="image-audio-button-about"]').click().should("have.attr", "aria-pressed", "true");
    cy.get('[data-cy="to-fr"]').click();
    cy.get('[data-cy="image-audio-button-about"]').should("have.attr", "aria-pressed", "false");
    cy.window().its("__paused").should("be.gte", 1);
  });

  it("getImageAudioSrc follows the naming convention and never invents Mi'kmaq", () => {
    expect(getImageAudioSrc("about", "en")).to.equal("/audio/images/about_en.mp3");
    expect(getImageAudioSrc("vision", "fr")).to.equal("/audio/images/vision_fr.mp3");
    expect(getImageAudioSrc("about", "mic")).to.equal(null);
    expect(getImageAudioSrc("nope", "en")).to.equal(null);
    expect(getImageAudioSrc("toString", "en")).to.equal(null);
  });

  it("an earlier play() rejecting late does not mark the newer playback unavailable", () => {
    let rejectFirst;
    cy.window().then((win) => {
      let calls = 0;
      win.__playResult = () => {
        calls += 1;
        if (calls === 1) return new Promise((_, reject) => { rejectFirst = reject; });
        return Promise.resolve();
      };
    });
    mountButtons();
    cy.get('[data-cy="image-audio-button-one"]').click();
    cy.get('[data-cy="image-audio-button-two"]').click().should("have.attr", "aria-pressed", "true");
    cy.then(() => rejectFirst(new Error("late")));
    cy.get('[data-cy="image-audio-button-two"]').should("have.attr", "aria-pressed", "true");
    cy.get('[data-cy="image-audio-unavailable-two"]').should("not.exist");
    cy.get('[data-cy="image-audio-unavailable-one"]').should("not.exist");
  });
});
