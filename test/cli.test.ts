import test from "node:test";
import assert from "node:assert/strict";
import { formatAgentOutput, parseArgs } from "../src/cli.ts";

test("parseArgs reads mode, context path, and json output", () => {
  const result = parseArgs([
    "--mode",
    "campaign",
    "--context-path",
    "custom/context.md",
    "--json",
    "Build",
    "a",
    "launch",
    "plan"
  ]);

  assert.deepEqual(result, {
    contextPath: "custom/context.md",
    interactive: false,
    mode: "campaign",
    output: "json",
    prompt: "Build a launch plan",
    workflow: "general"
  });
});

test("parseArgs rejects an invalid mode", () => {
  assert.throws(() => parseArgs(["--mode", "invalid"]), /Expected --mode/);
});

test("formatAgentOutput returns JSON when requested", () => {
  const output = formatAgentOutput({
    contextPath: "docs/company/company-context.md",
    mode: "workflow",
    output: "json",
    response: "Plan ready",
    workflow: "ai-adoption-plan"
  });

  assert.equal(
    output,
    JSON.stringify(
      {
        contextPath: "docs/company/company-context.md",
        mode: "workflow",
        response: "Plan ready",
        workflow: "ai-adoption-plan"
      },
      null,
      2
    )
  );
});

test("parseArgs reads workflow option", () => {
  const result = parseArgs(["--workflow", "experiment-plan", "Design", "a", "test"]);

  assert.equal(result.workflow, "experiment-plan");
  assert.equal(result.prompt, "Design a test");
});
