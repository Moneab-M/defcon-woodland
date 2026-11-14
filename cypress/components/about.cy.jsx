import React from "react";
import { mount } from "cypress/react";
import About from "../../src/pages/About.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("About Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );
  });

  it("shows the page title", () => {
    mount(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );
    cy.contains("About St. Margaret’s Bay Woodland Conservation").should("exist");
  });
});
