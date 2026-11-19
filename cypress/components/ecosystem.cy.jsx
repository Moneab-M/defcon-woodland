import React from "react";
import { mount } from "cypress/react";
import Ecosystem from "../../src/pages/Ecosystem.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("Ecosystem Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <Ecosystem />
      </LanguageProvider>
    );
  });

  it("has ecosystem content", () => {
    mount(
      <LanguageProvider>
        <Ecosystem />
      </LanguageProvider>
    );
    cy.contains("Ecosystem").should("exist");
  });
});
