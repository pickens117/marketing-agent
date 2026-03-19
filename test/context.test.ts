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
    "---\ncategory: brand\npriority: high\n---\n# Brand\nUse a calm and credible voice.",
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
  const brandSection = result?.sections.find((section) => section.path === "brand-guidelines.md");
  assert.equal(brandSection?.metadata.priority, "high");
  assert.equal(brandSection?.priority, 0);
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

test("loadCompanyContext orders sections by priority", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "marketing-agent-"));
  const docsDir = path.join(tempDir, "docs/company");

  await mkdir(docsDir, { recursive: true });
  await writeFile(path.join(docsDir, "legal-constraints.md"), "---\ncategory: legal\npriority: high\n---\n# Legal\nLegal first", "utf8");
  await writeFile(path.join(docsDir, "research-summary.md"), "---\ncategory: research\npriority: low\n---\n# Research\nResearch later", "utf8");
  await writeFile(
    path.join(docsDir, "company-context.md"),
    "# Company Context\n\n- @research-summary.md\n- @legal-constraints.md",
    "utf8"
  );

  const result = await loadCompanyContext(path.join(docsDir, "company-context.md"), ["legal", "research"]);

  assert.ok(result);
  assert.equal(result?.sections[0]?.path, "legal-constraints.md");
  assert.equal(result?.sections[1]?.path, "research-summary.md");
});

test("loadCompanyContext returns null for a missing file", async () => {
  const result = await loadCompanyContext("/tmp/does-not-exist-company-context.md");
  assert.equal(result, null);
});
