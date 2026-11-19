
import React from "react";
import { mount } from "cypress/react";
import Home from "../../src/pages/Home.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";

describe("Home Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Home />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );
  });

  it("displays welcome message", () => {
    mount(
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <Home />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    );

    cy.contains("Welcome to the Woodland Conservation Site").should("exist");
  });
});
