import test from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/cli.ts";

test("parseArgs reads out, review, chain, and bootstrap flags", () => {
  const result = parseArgs([
    "--out",
    "outputs/brief.md",
    "--review",
    "--chain",
    "--bootstrap-company",
    "Prompt"
  ]);

  assert.equal(result.outPath, "outputs/brief.md");
  assert.equal(result.review, true);
  assert.equal(result.chain, true);
  assert.equal(result.bootstrapCompany, true);
});
