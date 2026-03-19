import { readFile } from "node:fs/promises";
import path from "node:path";
import { defaultContextPath } from "../src/context.js";
import { runMarketingAgent } from "../src/agent.js";
import type { WorkflowId } from "../src/workflows.js";

type EvalCase = {
  expectedHeadings: string[];
  id: string;
  prompt: string;
  qualities: string[];
  workflow: WorkflowId;
};

type EvalFile = {
  cases: EvalCase[];
};

function scoreCase(output: string, evalCase: EvalCase): { matched: number; total: number } {
  const headingsMatched = evalCase.expectedHeadings.filter((heading) =>
    output.toLowerCase().includes(heading.toLowerCase())
  ).length;
  const qualitiesMatched = evalCase.qualities.filter((quality) =>
    output.toLowerCase().includes(quality.toLowerCase())
  ).length;

  return {
    matched: headingsMatched + qualitiesMatched,
    total: evalCase.expectedHeadings.length + evalCase.qualities.length
  };
}

async function main(): Promise<void> {
  const evalPath = path.resolve(process.cwd(), "evals/cases.json");
  const evalFile = JSON.parse(await readFile(evalPath, "utf8")) as EvalFile;
  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);

  for (const evalCase of evalFile.cases) {
    let output = "";

    if (hasApiKey) {
      output = await runMarketingAgent({
        contextPath: defaultContextPath,
        mode: "coach",
        prompt: evalCase.prompt,
        stream: false,
        workflow: evalCase.workflow
      });
    } else {
      output = `Dry run only.
Expected headings: ${evalCase.expectedHeadings.join(", ")}
Expected qualities: ${evalCase.qualities.join(", ")}`;
    }

    const score = scoreCase(output, evalCase);
    console.log(`${evalCase.id}: ${score.matched}/${score.total}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
