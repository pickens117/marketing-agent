import test from "node:test";
import assert from "node:assert/strict";
import { formatAgentOutput, parseArgs, renderHelp, renderWorkflowList } from "../src/cli.ts";

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
    bootstrapCompany: false,
    chain: false,
    contextPath: "custom/context.md",
    help: false,
    interactive: false,
    mode: "campaign",
    outPath: undefined,
    output: "json",
    prompt: "Build a launch plan",
    review: false,
    workflow: "general",
    workflowList: false
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
        sections: {},
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
  assert.equal(result.bootstrapCompany, false);
  assert.equal(result.chain, false);
  assert.equal(result.help, false);
  assert.equal(result.outPath, undefined);
  assert.equal(result.review, false);
  assert.equal(result.workflowList, false);
});

test("renderHelp mentions workflow list", () => {
  assert.match(renderHelp(), /--workflow-list/);
});

test("renderWorkflowList includes campaign brief", () => {
  assert.match(renderWorkflowList(), /campaign-brief/);
});
