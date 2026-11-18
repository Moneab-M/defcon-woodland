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
});
