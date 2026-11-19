import React from "react";
import { mount } from "cypress/react";
import About from "../../src/pages/About.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

describe("About Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <About />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
  });

  it("shows the page title", () => {
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <About />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.contains("About St. Margaret’s Bay Woodland Conservation").should("exist");
  });

  it("shows exactly one Image Audio Button per image (three)", () => {
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <About />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.get('[data-cy^="image-audio-button-"]').should("have.length", 3);
  });

  it("never uses text-to-speech when image audio fails", () => {
    cy.window().then((win) => {
      win.speechSynthesis.speak = cy.stub().as("speak");
      // No real audio or network: a fake Audio whose play() always fails
      cy.stub(win, "Audio").callsFake(() => ({
        pause() {},
        play: () => Promise.reject(new Error("missing")),
      }));
    });
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <About />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
    cy.get('[data-cy="image-audio-button-about"]').click();
    cy.get('[data-cy="image-audio-unavailable-about"]').should("be.visible");
    cy.get("@speak").should("not.have.been.called");
  });
});
