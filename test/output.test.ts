import test from "node:test";
import assert from "node:assert/strict";
import { buildOutputPath } from "../src/output.ts";

test("buildOutputPath uses explicit path when provided", () => {
  const outputPath = buildOutputPath("campaign-brief", "Launch prompt", "outputs/custom.md");
  assert.match(outputPath, /outputs\/custom\.md$/);
});

test("buildOutputPath generates a default markdown file path", () => {
  const outputPath = buildOutputPath("campaign-brief", "Launch prompt");
  assert.match(outputPath, /outputs\/.*campaign-brief.*\.md$/);
});
