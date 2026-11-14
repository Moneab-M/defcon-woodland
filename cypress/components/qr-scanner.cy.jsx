/**
 * @file qr-scanner.cy.jsx
 * @description Component tests for the Talking Tree sign scanner. The camera
 * and the detector are stubbed: no real camera and no network are used.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-55 | SRS: Talking Tree
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import TalkingTrees from "../../src/pages/TalkingTrees.jsx";
import QrScanner from "../../src/Components/QrScanner.jsx";
import { scanDeps } from "../../src/talkingTrees/cameraScan.js";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext.jsx";
import en from "../../src/i18n/en.js";
import fr from "../../src/i18n/fr.js";

const original = { ...scanDeps };
let tracks;
let detections; // array of detect() results, last one repeats

/** Purpose: Fake camera stream whose tracks have spy-able stop(). */
function fakeStream() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const stream = canvas.captureStream();
  tracks = stream.getTracks();
  tracks.forEach((track) => cy.spy(track, "stop"));
  return stream;
}

/** Purpose: Fake detector returning the next prepared result. */
function fakeDetector() {
  let i = 0;
  return Promise.resolve({
    detect: () => Promise.resolve(detections[Math.min(i++, detections.length - 1)]),
  });
}

/** Purpose: Button so a test can change language without a reload. */
function FrenchButton() {
  const { setLanguage } = useLanguage();
  return <button data-cy="to-fr" onClick={() => setLanguage("fr")}>fr</button>;
}

/** Purpose: Mount the scanner with an opener button and an onFound spy. */
function mountScanner(onFound) {
  function Host() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <FrenchButton />
        <button data-cy="opener" onClick={() => setOpen(true)}>open</button>
        <QrScanner open={open} onClose={() => setOpen(false)} onFound={(id) => { setOpen(false); onFound(id); }} onPickFromList={() => setOpen(false)} />
      </>
    );
  }
  mount(
    <MemoryRouter>
      <LanguageProvider>
        <Host />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("QR scanner (SCRUM-55)", () => {
  beforeEach(() => {
    detections = [[{ rawValue: "wca-tree:yellow-birch-1" }]];
    scanDeps.getStream = cy.stub().callsFake(() => Promise.resolve(fakeStream()));
    scanDeps.createDetector = cy.stub().callsFake(fakeDetector);
  });
  afterEach(() => {
    Object.assign(scanDeps, original);
  });

  it("explains first and does not ask for the camera until the visitor taps", () => {
    mountScanner(cy.stub());
    cy.get("[data-cy=opener]").click();
    cy.get("[data-cy=scanner-dialog]").should("have.attr", "role", "dialog").and("have.attr", "aria-modal", "true");
    cy.get("[data-cy=scanner-explain]").should("contain.text", en.trees.scanner.explain);
    cy.wrap(null).then(() => expect(scanDeps.getStream).not.to.have.been.called);
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("[data-cy=scanner-video]").should("exist");
    cy.wrap(null).then(() => expect(scanDeps.getStream).to.have.been.calledOnce);
  });

  it("calls onFound with the tree ID, stops the camera and closes", () => {
    const onFound = cy.stub().as("onFound");
    mountScanner(onFound);
    cy.get("[data-cy=opener]").click();
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("@onFound").should("have.been.calledOnceWith", "yellow-birch-1");
    cy.get("[data-cy=scanner-dialog]").should("not.exist");
    cy.wrap(null).then(() => tracks.forEach((track) => expect(track.stop).to.have.been.called));
  });

  it("shows a kind message for a code that is not a tree and keeps scanning", () => {
    detections = [[{ rawValue: "https://example.com/other" }]];
    const onFound = cy.stub();
    mountScanner(onFound);
    cy.get("[data-cy=opener]").click();
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("[data-cy=scanner-status]").should("contain.text", en.trees.scanner.notTree);
    cy.get("[data-cy=scanner-video]").should("exist");
    cy.wrap(null).then(() => {
      expect(onFound).not.to.have.been.called;
      tracks.forEach((track) => expect(track.stop).not.to.have.been.called);
    });
  });

  it("shows a reassuring message and a list link when the camera is refused", () => {
    scanDeps.getStream = cy.stub().callsFake(() => Promise.reject(new DOMException("x", "NotAllowedError")));
    mountScanner(cy.stub());
    cy.get("[data-cy=opener]").click();
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("[data-cy=scanner-denied]").should("contain.text", en.trees.scanner.denied);
    cy.get("[data-cy=scanner-pick-list]").should("be.visible");
  });

  it("shows the same message when there is no camera at all", () => {
    scanDeps.getStream = cy.stub().callsFake(() => Promise.reject(new Error("Camera is not available")));
    mountScanner(cy.stub());
    cy.get("[data-cy=opener]").click();
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("[data-cy=scanner-denied]").should("be.visible");
  });

  it("closes with Escape, stops the camera and returns focus to the opener", () => {
    detections = [[]];
    mountScanner(cy.stub());
    cy.get("[data-cy=opener]").focus().click();
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("[data-cy=scanner-video]").should("exist");
    cy.get("#qr-scanner-heading").type("{esc}");
    cy.get("[data-cy=scanner-dialog]").should("not.exist");
    cy.get("[data-cy=opener]").should("have.focus");
    cy.wrap(null).then(() => tracks.forEach((track) => expect(track.stop).to.have.been.called));
  });

  it("moves focus into the dialog and keeps controls at least 44 px", () => {
    mountScanner(cy.stub());
    cy.get("[data-cy=opener]").click();
    cy.focused().should("have.attr", "id", "qr-scanner-heading");
    cy.get("[data-cy=scanner-turn-on]").invoke("outerHeight").should("be.gte", 44);
    cy.get("[data-cy=scanner-not-now]").invoke("outerHeight").should("be.gte", 44);
  });

  it("shows French text", () => {
    mountScanner(cy.stub());
    cy.get("[data-cy=to-fr]").click();
    cy.get("[data-cy=opener]").click();
    cy.get("[data-cy=scanner-explain]").should("contain.text", fr.trees.scanner.explain);
    cy.get("[data-cy=scanner-turn-on]").should("contain.text", fr.trees.scanner.turnOn);
  });

  it("on the Talking Trees page the pick-from-list link focuses the list and #scan focuses the button", () => {
    scanDeps.getStream = cy.stub().callsFake(() => Promise.reject(new DOMException("x", "NotAllowedError")));
    mount(
      <MemoryRouter initialEntries={["/trees#scan"]}>
        <LanguageProvider>
          <TalkingTrees />
        </LanguageProvider>
      </MemoryRouter>
    );
    cy.get("[data-cy=open-scanner]").should("have.focus").and("contain.text", en.trees.scanner.open);
    cy.wrap(null).then(() => expect(scanDeps.getStream).not.to.have.been.called);
    cy.get("[data-cy=open-scanner]").click();
    cy.get("[data-cy=scanner-turn-on]").click();
    cy.get("[data-cy=scanner-pick-list]").click();
    cy.get("[data-cy=scanner-dialog]").should("not.exist");
    cy.focused().should("have.attr", "aria-label", en.trees.page.listLabel);
  });
});
