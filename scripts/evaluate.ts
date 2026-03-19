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
  rubric?: {
    must_avoid?: string[];
    must_include?: string[];
    target_headings?: string[];
  };
  workflow: WorkflowId;
};

type EvalFile = {
  cases: EvalCase[];
};

function scoreCase(output: string, evalCase: EvalCase): {
  matched: number;
  notes: string[];
  total: number;
} {
  const notes: string[] = [];
  const headingsMatched = evalCase.expectedHeadings.filter((heading) =>
    output.toLowerCase().includes(heading.toLowerCase())
  ).length;
  const qualitiesMatched = evalCase.qualities.filter((quality) =>
    output.toLowerCase().includes(quality.toLowerCase())
  ).length;
  let rubricMatched = 0;
  let rubricTotal = 0;

  if (evalCase.rubric?.must_include) {
    rubricTotal += evalCase.rubric.must_include.length;
    for (const phrase of evalCase.rubric.must_include) {
      if (output.toLowerCase().includes(phrase.toLowerCase())) {
        rubricMatched += 1;
      } else {
        notes.push(`Missing expected phrase: ${phrase}`);
      }
    }
  }

  if (evalCase.rubric?.must_avoid) {
    rubricTotal += evalCase.rubric.must_avoid.length;
    for (const phrase of evalCase.rubric.must_avoid) {
      if (!output.toLowerCase().includes(phrase.toLowerCase())) {
        rubricMatched += 1;
      } else {
        notes.push(`Included risky phrase: ${phrase}`);
      }
    }
  }

  if (evalCase.rubric?.target_headings) {
    rubricTotal += evalCase.rubric.target_headings.length;
    for (const heading of evalCase.rubric.target_headings) {
      if (output.toLowerCase().includes(heading.toLowerCase())) {
        rubricMatched += 1;
      } else {
        notes.push(`Missing rubric heading: ${heading}`);
      }
    }
  }

  return {
    matched: headingsMatched + qualitiesMatched + rubricMatched,
    notes,
    total: evalCase.expectedHeadings.length + evalCase.qualities.length + rubricTotal
  };
}

async function loadEvalFiles(): Promise<EvalFile[]> {
  const evalPaths = [
    path.resolve(process.cwd(), "evals/cases.json"),
    path.resolve(process.cwd(), "evals/red-team.json")
  ];

  const files: EvalFile[] = [];
  for (const evalPath of evalPaths) {
    files.push(JSON.parse(await readFile(evalPath, "utf8")) as EvalFile);
  }

  return files;
}

async function main(): Promise<void> {
  const evalFiles = await loadEvalFiles();
  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);

  for (const evalFile of evalFiles) {
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
      if (score.notes.length > 0) {
        for (const note of score.notes) {
          console.log(`  - ${note}`);
        }
      }
    }
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
