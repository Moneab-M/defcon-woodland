describe("Natural Burial Page (E2E)", () => {
  it("loads successfully", () => {
    cy.visit("http://localhost:5173/NaturalBurial");
    cy.contains("Natural Burial").should("exist");
  });

  it("shows burial-related content", () => {
    cy.visit("http://localhost:5173/NaturalBurial");
    cy.get(".natural-burial img.header-image").should("be.visible");
  });
});
