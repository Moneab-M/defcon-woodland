import React from "react";
import { mount } from "cypress/react";
import MapView from "../../src/pages/MapView.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("Map Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <MapView />
      </LanguageProvider>
    );
  });

  it("renders map controls or buttons", () => {
    mount(
      <LanguageProvider>
        <MapView />
      </LanguageProvider>
    );
    cy.contains("YOU ARE HERE").should("exist");
  });
});
