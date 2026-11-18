/**
 * @file tree-qr-payload.cy.jsx
 * @description Plain assertions on the Talking Tree list and QR payload functions.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-53
 */
import { QR_PREFIX, buildTreeQrPayload, parseTreeQrPayload } from "../../src/talkingTrees/qrPayload.js";
import { TALKING_TREES, getTreeById, getTreeByMapPoiId } from "../../src/talkingTrees/trees.js";

describe("Talking Tree QR payload (SCRUM-53)", () => {
  it("builds and reads the prefix form", () => {
    expect(QR_PREFIX).to.equal("wca-tree:");
    expect(buildTreeQrPayload("red-maple-1")).to.equal("wca-tree:red-maple-1");
    expect(parseTreeQrPayload("wca-tree:yellow-birch-1")).to.equal("yellow-birch-1");
    expect(parseTreeQrPayload("  wca-tree:white-pine-1 \n")).to.equal("white-pine-1");
  });

  it("accepts an upper-case prefix", () => {
    expect(parseTreeQrPayload("WCA-TREE:red-spruce-1")).to.equal("red-spruce-1");
  });

  it("accepts the URL form, with and without a trailing slash", () => {
    expect(parseTreeQrPayload("https://example.org/trees/red-spruce-1")).to.equal("red-spruce-1");
    expect(parseTreeQrPayload("http://example.org/a/trees/red-spruce-1/")).to.equal("red-spruce-1");
  });

  it("returns null for an unknown tree", () => {
    expect(parseTreeQrPayload("wca-tree:oak-9")).to.equal(null);
    expect(parseTreeQrPayload("https://example.org/trees/oak-9")).to.equal(null);
  });

  it("returns null for malformed or unrelated text and never throws", () => {
    expect(parseTreeQrPayload("tree:red-spruce-1")).to.equal(null);
    expect(parseTreeQrPayload("")).to.equal(null);
    expect(parseTreeQrPayload(null)).to.equal(null);
    expect(parseTreeQrPayload(42)).to.equal(null);
    expect(parseTreeQrPayload("wca-tree:")).to.equal(null);
    expect(parseTreeQrPayload("wca-tree:Red-Spruce-1")).to.equal(null);
    expect(parseTreeQrPayload("https://example.org/about/red-spruce-1")).to.equal(null);
    expect(parseTreeQrPayload("http://")).to.equal(null);
  });

  it("finds trees by id and by map point", () => {
    expect(TALKING_TREES).to.have.length(4);
    expect(getTreeById("red-maple-1").species).to.equal("redMaple");
    expect(getTreeById("nope")).to.equal(null);
    expect(getTreeByMapPoiId("yellowBirch").id).to.equal("yellow-birch-1");
    expect(getTreeByMapPoiId("well")).to.equal(null);
    expect(getTreeByMapPoiId(null)).to.equal(null);
  });
});
