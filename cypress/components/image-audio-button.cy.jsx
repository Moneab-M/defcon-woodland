/**
 * @file image-audio-button.cy.jsx
 * @description Component tests for the Image Audio Button and the shared Prerecorded Audio Player.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-9 | SRS: [ID 103], [ID 307], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - Cypress component testing: https://docs.cypress.io/app/core-concepts/testing-types
 */

import React from "react";
import { mount } from "cypress/react";
import ImageAudioButton from "../../src/Components/ImageAudioButton.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
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
});
