/**
 * @file talking-trees-flow.cy.jsx
 * @description End-to-end style component tests for the whole Talking Trees
 * experience (map, nearby prompt, scanner, tree page) using the real App.
 * Location, camera, detector and map tiles are all mocked: no real GPS, no
 * real camera and no network are used.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-58 | SRS: Talking Tree
 */

import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../../src/App.jsx";
import { LanguageProvider } from "../../src/context/LanguageContext.jsx";
import { PrerecordedAudioProvider } from "../../src/context/PrerecordedAudioContext.jsx";
import { scanDeps } from "../../src/talkingTrees/cameraScan.js";
import en from "../../src/i18n/en.js";
import fr from "../../src/i18n/fr.js";

const original = { ...scanDeps };
const BIRCH = { latitude: 44.62464, longitude: -63.920329 };
const FAR = { latitude: 44.63, longitude: -63.93 };
let tracks;

/** Purpose: Show the current route so tests can assert where the visitor is. */
function WhereAmI() {
  const { pathname } = useLocation();
  return <span data-cy="where" data-path={pathname} hidden />;
}

/** Purpose: Mount the real App with the same providers as src/main.jsx. */
function mountApp(path) {
  mount(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <PrerecordedAudioProvider>
          <WhereAmI />
          <App />
        </PrerecordedAudioProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

/** Purpose: Make navigator.geolocation answer with a position or an error. */
function stubLocation(result) {
  cy.window().then((win) => {
    cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((ok, fail) => {
      if (result.error) fail(result.error);
      else ok({ coords: result });
    });
  });
}

/** Purpose: Fake camera stream whose tracks have a spy on stop(). */
function fakeStream() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const stream = canvas.captureStream();
  tracks = stream.getTracks();
  tracks.forEach((track) => cy.spy(track, "stop"));
  return stream;
}

/** Purpose: Assert the current route. */
function shouldBeAt(path) {
  cy.get("[data-cy=where]").should("have.attr", "data-path", path);
}

/** Purpose: Run the scan steps (open scanner, camera on) with the given texts. */
function scanTheSign(text) {
  cy.get("[data-cy=open-scanner]").click();
  cy.get("[data-cy=scanner-explain]").should("have.text", text.trees.scanner.explain);
  cy.get("[data-cy=scanner-turn-on]").click();
}

/** Purpose: Assert the tree page shows the character, facts and audio button. */
function treePageShowsEverything(text) {
  shouldBeAt("/trees/yellow-birch-1");
  cy.get("[data-cy=tree-name]").should("have.text", text.trees.species.yellowBirch.name);
  cy.get("[data-cy=tree-character-yellowBirch]").should("be.visible");
  cy.get("[data-cy=tree-facts] li").should("have.length.greaterThan", 0);
  cy.get("[data-cy=tree-facts] li").first().should("have.text", text.trees.species.yellowBirch.facts[0]);
  cy.get("[data-cy=tree-audio-button]").should("be.visible");
}

/** Purpose: Walk map -> prompt -> scan link -> scanner -> tree page in one language. */
function nearThenScan(text) {
  mountApp("/map");
  stubLocation(BIRCH);
  cy.contains("button", text.map.youAreHere).click();
  cy.get("[data-cy=tree-nearby-prompt]")
    .should("be.visible")
    .and("contain.text", text.trees.species.yellowBirch.name);
  cy.get("[data-cy=tree-nearby-prompt]").should("contain.text", text.trees.nearby.scan);
  cy.get("[data-cy=tree-nearby-scan]").click();
  shouldBeAt("/trees");
  cy.get("[data-cy=open-scanner]").should("have.focus");
  scanTheSign(text);
  treePageShowsEverything(text);
  cy.then(() => {
    expect(tracks.length).to.be.greaterThan(0);
    tracks.forEach((track) => expect(track.stop).to.have.been.called);
  });
}

describe("Talking Trees flow (SCRUM-58)", () => {
  beforeEach(() => {
    // No network: every map tile request gets an empty answer.
    cy.intercept("GET", "**/*.tile.openstreetmap.org/**", { statusCode: 200, body: "" });
    scanDeps.getStream = cy.stub().callsFake(() => Promise.resolve(fakeStream()));
    scanDeps.createDetector = cy.stub().callsFake(() =>
      Promise.resolve({ detect: () => Promise.resolve([{ rawValue: "wca-tree:yellow-birch-1" }]) })
    );
  });
  afterEach(() => {
    Object.assign(scanDeps, original);
  });

  it("near the yellow birch: prompt, scan link, scan, tree page, and no coordinates stored", () => {
    nearThenScan(en);
    cy.then(() => {
      [window.localStorage, window.sessionStorage].forEach((store) => {
        for (let i = 0; i < store.length; i++) {
          const value = `${store.key(i)}=${store.getItem(store.key(i))}`;
          expect(value, "stored value").to.not.contain("44.62");
          expect(value, "stored value").to.not.contain("63.92");
        }
      });
    });
  });

  it("out of range: no nearby prompt", () => {
    mountApp("/map");
    stubLocation(FAR);
    cy.contains("button", en.map.youAreHere).click();
    cy.get("[data-cy=location-fallback]").should("not.exist");
    cy.contains(en.map.status.found).should("be.visible");
    cy.get("[data-cy=tree-nearby-prompt]").should("not.exist");
  });

  it("location denied: fallback, pick from the list, see the tree page", () => {
    mountApp("/map");
    stubLocation({ error: { code: 1 } });
    cy.contains("button", en.map.youAreHere).click();
    cy.get("[data-cy=location-fallback]").should("be.visible");
    cy.get("[data-cy=tree-nearby-prompt]").should("not.exist");
    cy.get("[data-cy=location-fallback-list]").click();
    shouldBeAt("/trees");
    cy.get("[data-cy=tree-link-yellow-birch-1]").click();
    treePageShowsEverything(en);
  });

  it("camera denied: kind message, then pick a tree from the list", () => {
    scanDeps.getStream = cy.stub().callsFake(() =>
      Promise.reject(new DOMException("denied", "NotAllowedError"))
    );
    mountApp("/trees");
    scanTheSign(en);
    cy.get("[data-cy=scanner-denied]").should("have.text", en.trees.scanner.denied);
    cy.get("[data-cy=scanner-pick-list]").click();
    cy.get("[data-cy=scanner-overlay]").should("not.exist");
    shouldBeAt("/trees");
    cy.get("[data-cy=tree-link-yellow-birch-1]").click();
    treePageShowsEverything(en);
  });

  it("works in French: prompt, scanner explanation and tree page", () => {
    cy.window().then((win) => win.localStorage.setItem("wc_selected_language", "fr"));
    nearThenScan(fr);
    cy.get("[data-cy=tree-name]").should("not.have.text", en.trees.species.yellowBirch.name);
  });
});
