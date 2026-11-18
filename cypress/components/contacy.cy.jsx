import React from "react";
import { mount } from "cypress/react";
import Contact from "../../src/pages/Contact.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

describe("Contact Page Component", () => {
  it("mounts successfully", () => {
    mount(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );
  });

  it("renders the form fields", () => {
    mount(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );
    cy.contains("Full Name").should("exist");
    cy.contains("Email Address").should("exist");
  });
});
