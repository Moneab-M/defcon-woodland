import React from "react";
import { mount } from "cypress/react";
import Gallery from "../../src/pages/Gallery.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("Gallery Page Component", () => {
  it("mounts successfully", () => {
    mount(<LanguageProvider><Gallery /></LanguageProvider>);
  });

  it("shows gallery images or section title", () => {
    mount(<LanguageProvider><Gallery /></LanguageProvider>);
    cy.contains("Gallery").should("exist");
  });
});
