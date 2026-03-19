import type { AgentMode } from "./system-prompt.js";
import { getWorkflowDefinition, isWorkflowId, listWorkflowIds, type WorkflowId } from "./workflows.js";

export type OutputFormat = "text" | "json";

export type CliOptions = {
  contextPath?: string;
  help: boolean;
  interactive: boolean;
  mode: AgentMode;
  output: OutputFormat;
  prompt: string;
  workflow: WorkflowId;
  workflowList: boolean;
};

const validModes = new Set<AgentMode>(["coach", "campaign", "workflow"]);

export function parseArgs(argv: string[]): CliOptions {
  let interactive = false;
  let help = false;
  let mode: AgentMode = "coach";
  let output: OutputFormat = "text";
  let contextPath: string | undefined;
  let workflow: WorkflowId = "general";
  let workflowList = false;
  const promptParts: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--interactive") {
      interactive = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }

    if (arg === "--mode") {
      const value = argv[index + 1];
      if (value && validModes.has(value as AgentMode)) {
        mode = value as AgentMode;
        index += 1;
        continue;
      }

      throw new Error("Expected --mode to be one of: coach, campaign, workflow.");
    }

    if (arg === "--context-path") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Expected --context-path to be followed by a file path.");
      }

      contextPath = value;
      index += 1;
      continue;
    }

    if (arg === "--json") {
      output = "json";
      continue;
    }

    if (arg === "--workflow-list") {
      workflowList = true;
      continue;
    }

    if (arg === "--workflow") {
      const value = argv[index + 1];
      if (value && isWorkflowId(value)) {
        workflow = value;
        index += 1;
        continue;
      }

      throw new Error(`Expected --workflow to be one of: ${listWorkflowIds().join(", ")}.`);
    }

    promptParts.push(arg);
  }

  return {
    contextPath,
    help,
    interactive,
    mode,
    output,
    prompt: promptParts.join(" ").trim(),
    workflow,
    workflowList
  };
}

function extractSections(response: string, workflow: WorkflowId): Record<string, string> {
  const sectionTitles = getWorkflowDefinition(workflow).sectionTitles;
  const lines = response.split("\n");
  const sections: Record<string, string> = {};
  let currentTitle: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const matchedTitle = sectionTitles.find((title) => line === `## ${title}` || line === title);

    if (matchedTitle) {
      currentTitle = matchedTitle;
      sections[currentTitle] = "";
      continue;
    }

    if (currentTitle) {
      sections[currentTitle] = `${sections[currentTitle]}${sections[currentTitle] ? "\n" : ""}${rawLine}`;
    }
  }

  return sections;
}

export function formatAgentOutput(result: {
  contextPath?: string;
  mode: AgentMode;
  output: OutputFormat;
  response: string;
  workflow: WorkflowId;
}): string {
  if (result.output === "json") {
    return JSON.stringify(
      {
        contextPath: result.contextPath ?? null,
        mode: result.mode,
        response: result.response,
        sections: extractSections(result.response, result.workflow),
        workflow: result.workflow
      },
      null,
      2
    );
  }

  return result.response;
}

export function renderHelp(): string {
  return `Marketing Agent CLI

Usage:
  npm run agent -- [options] "your prompt"

Options:
  --mode <coach|campaign|workflow>
  --workflow <${listWorkflowIds().join("|")}>
  --workflow-list
  --context-path <path>
  --json
  --interactive
  --help

Examples:
  npm run agent -- --workflow campaign-brief "Create a launch brief for our new feature"
  npm run agent -- --workflow ai-adoption-plan --json "Create a rollout plan for our content team"
`;
}

export function renderWorkflowList(): string {
  return listWorkflowIds()
    .map((workflowId) => `- ${workflowId}: ${getWorkflowDefinition(workflowId).description}`)
    .join("\n");
}
