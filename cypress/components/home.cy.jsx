import React from "react";
import { mount } from "cypress/react";
import Home from "../../src/pages/Home.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("Home Page Component", () => {
  it("mounts successfully", () => {
    mount(<LanguageProvider><Home /></LanguageProvider>);
  });

  it("displays welcome message", () => {
    mount(<LanguageProvider><Home /></LanguageProvider>);
    cy.contains("Welcome to the Woodland Conservation Site").should("exist");
  });
});
