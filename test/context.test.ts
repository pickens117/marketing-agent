import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { loadCompanyContext } from "../src/context.ts";

test("loadCompanyContext includes referenced files when present", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "marketing-agent-"));
  const docsDir = path.join(tempDir, "docs/company");

  await mkdir(docsDir, { recursive: true });
  await writeFile(
    path.join(docsDir, "brand-guidelines.md"),
    "# Brand\nUse a calm and credible voice.",
    "utf8"
  );
  await writeFile(
    path.join(docsDir, "company-context.md"),
    "# Company Context\n\n- @brand-guidelines.md",
    "utf8"
  );

  const result = await loadCompanyContext(path.join(docsDir, "company-context.md"));

  assert.ok(result);
  assert.equal(result?.referencedFiles[0], "brand-guidelines.md");
  assert.match(result?.content ?? "", /Use a calm and credible voice/);
});

test("loadCompanyContext filters referenced content by category", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "marketing-agent-"));
  const docsDir = path.join(tempDir, "docs/company");

  await mkdir(docsDir, { recursive: true });
  await writeFile(path.join(docsDir, "brand-guidelines.md"), "# Brand\nBrand rule", "utf8");
  await writeFile(path.join(docsDir, "personas.md"), "# Persona\nPersona rule", "utf8");
  await writeFile(
    path.join(docsDir, "company-context.md"),
    "# Company Context\n\n- @brand-guidelines.md\n- @personas.md",
    "utf8"
  );

  const result = await loadCompanyContext(path.join(docsDir, "company-context.md"), ["brand"]);

  assert.ok(result);
  assert.match(result?.content ?? "", /Brand rule/);
  assert.doesNotMatch(result?.content ?? "", /Persona rule/);
});

test("loadCompanyContext returns null for a missing file", async () => {
  const result = await loadCompanyContext("/tmp/does-not-exist-company-context.md");
  assert.equal(result, null);
});
