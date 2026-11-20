describe("Gallery Page (E2E)", () => {
  it("loads successfully", () => {
    cy.visit("http://localhost:5173/gallery");
    cy.contains("Gallery").should("exist");
  });

  it("renders a parallax gallery background", () => {
    cy.visit("http://localhost:5173/gallery");
    cy.get(".parallax-container")
      .first()
      .should("have.css", "background-image")
      .and("include", "url(");
  });
});
