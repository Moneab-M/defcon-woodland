import React from "react";
import { mount } from "cypress/react";
import NaturalBurial from "../../src/pages/NaturalBurial.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("Natural Burial Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <NaturalBurial />
      </LanguageProvider>
    );
  });

  it("displays natural burial content", () => {
    mount(
      <LanguageProvider>
        <NaturalBurial />
      </LanguageProvider>
    );
    cy.contains("Natural Burial").should("exist");
  });
});
