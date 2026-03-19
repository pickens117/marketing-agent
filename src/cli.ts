import type { AgentMode } from "./system-prompt.js";

export type OutputFormat = "text" | "json";

export type CliOptions = {
  contextPath?: string;
  interactive: boolean;
  mode: AgentMode;
  output: OutputFormat;
  prompt: string;
};

const validModes = new Set<AgentMode>(["coach", "campaign", "workflow"]);

export function parseArgs(argv: string[]): CliOptions {
  let interactive = false;
  let mode: AgentMode = "coach";
  let output: OutputFormat = "text";
  let contextPath: string | undefined;
  const promptParts: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--interactive") {
      interactive = true;
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

    promptParts.push(arg);
  }

  return {
    contextPath,
    interactive,
    mode,
    output,
    prompt: promptParts.join(" ").trim()
  };
}

export function formatAgentOutput(result: {
  contextPath?: string;
  mode: AgentMode;
  output: OutputFormat;
  response: string;
}): string {
  if (result.output === "json") {
    return JSON.stringify(
      {
        contextPath: result.contextPath ?? null,
        mode: result.mode,
        response: result.response
      },
      null,
      2
    );
  }

  return result.response;
}
