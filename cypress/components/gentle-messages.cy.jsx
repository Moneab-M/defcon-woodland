/**
 * @file gentle-messages.cy.jsx
 * @description Component tests for the gentle on-page messages on the Contact page
 * (replacing pop-up alerts). The server is mocked with cy.intercept.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-71 | SRS: [ID 316], [ID 317]
 */

import React from "react";
import { mount } from "cypress/react";
import Contact from "../../src/pages/Contact.jsx";
import LanguageSelector from "../../src/Components/LanguageSelector.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";

/** Purpose: Mount the Contact page with the Language Selector and a stubbed window.alert. */
function mountPage() {
  cy.window().then((win) => cy.stub(win, "alert").as("alert"));
  mount(
    <LanguageProvider>
      <LanguageSelector />
      <Contact />
    </LanguageProvider>
  );
}

describe("Gentle messages on the Contact page (SCRUM-71)", () => {
  beforeEach(() => {
    window.localStorage.removeItem("wc_selected_language");
  });

  it("shows a success message as a polite status, with no pop-up", () => {
    cy.intercept("POST", "/api/send-otp", { statusCode: 200, body: { message: "Code sent to your inbox." } });
    mountPage();
    cy.get('input[name="email"]').type("visitor@example.com");
    cy.contains("button", "Send OTP").click();
    cy.get('[data-cy="otp-message"] [role="status"]')
      .should("contain.text", "All good:")
      .and("contain.text", "Code sent to your inbox.");
    cy.get("@alert").should("not.have.been.called");
  });

  it("shows a failure message as an alert in English, with no pop-up", () => {
    cy.intercept("POST", "/api/send-confirmation", { statusCode: 500, body: {} });
    mountPage();
    cy.get('input[name="fullName"]').type("Sam");
    cy.get('input[name="email"]').type("sam@example.com");
    cy.get('select[name="inquiryType"]').select("General Inquiry");
    cy.contains("button", "Submit Inquiry").click();
    cy.get('[data-cy="submit-message"] [role="alert"]')
      .should("contain.text", "One more step:")
      .and("contain.text", "We could not send your form just now");
    cy.get("@alert").should("not.have.been.called");
    cy.get('[data-cy="gentle-message-dismiss"]').click();
    cy.get('[data-cy="submit-message"]').should("not.exist");
  });

  it("shows the failure message in French", () => {
    cy.intercept("POST", "/api/send-otp", { statusCode: 500, body: {} });
    window.localStorage.setItem("wc_selected_language", "fr");
    mountPage();
    cy.get('input[name="email"]').type("visitor@example.com");
    cy.contains("button", "Envoyer le code").click();
    cy.get('[data-cy="otp-message"] [role="alert"]')
      .should("contain.text", "Encore une étape\u00a0:")
      .and("contain.text", "Nous n'avons pas pu envoyer le code");
    cy.get("@alert").should("not.have.been.called");
  });

  it("does not show old code messages after Clear and a new code", () => {
    cy.intercept("POST", "/api/send-otp", { statusCode: 200, body: { message: "Code sent to your inbox." } });
    cy.intercept("POST", "/api/verify-otp", { statusCode: 200, body: { message: "The code is correct." } });
    mountPage();
    cy.get('input[name="email"]').type("visitor@example.com");
    cy.contains("button", "Send OTP").click();
    cy.get('input[name="otp"]').type("123456");
    cy.contains("button", "Verify OTP").click();
    cy.get('[data-cy="verify-message"]').should("contain.text", "The code is correct.");
    cy.contains("button", "Clear").click();
    cy.get('[data-cy="otp-message"]').should("not.exist");
    cy.get('[data-cy="verify-message"]').should("not.exist");
    cy.get('input[name="email"]').type("visitor@example.com");
    cy.contains("button", "Send OTP").click();
    cy.get('[data-cy="otp-message"]').should("contain.text", "Code sent to your inbox.");
    cy.get('[data-cy="verify-message"]').should("not.exist");
    cy.contains("The code is correct.").should("not.exist");
  });
});
