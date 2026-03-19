import { query } from "@anthropic-ai/claude-agent-sdk";
import { loadCompanyContext } from "./context.js";
import { buildSubagents } from "./subagents.js";
import { buildSystemPrompt, type AgentMode } from "./system-prompt.js";
import { getWorkflowDefinition, type WorkflowId } from "./workflows.js";

export type RunAgentOptions = {
  contextPath?: string;
  continueSession?: boolean;
  mode: AgentMode;
  prompt: string;
  stream?: boolean;
  workflow: WorkflowId;
};

export async function runMarketingAgent({
  contextPath,
  continueSession = false,
  mode,
  prompt,
  stream = true,
  workflow
}: RunAgentOptions): Promise<string> {
  let finalText = "";
  const companyContext = await loadCompanyContext(
    contextPath,
    getWorkflowDefinition(workflow).contextCategories
  );

  for await (const message of query({
    prompt,
    options: {
      continue: continueSession,
      tools: ["WebSearch"],
      maxTurns: 8,
      permissionMode: "dontAsk",
      systemPrompt: buildSystemPrompt(mode, workflow, companyContext),
      allowedTools: ["WebSearch"],
      agents: buildSubagents(mode)
    }
  })) {
    if (stream && message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") {
          process.stdout.write(block.text);
        }
      }
    }

    if (message.type === "result" && message.subtype === "success") {
      finalText = message.result;
    }

    if (message.type === "result" && message.subtype !== "success") {
      throw new Error(message.errors.join("\n") || "Claude agent run failed.");
    }
  }

  if (stream && !finalText) {
    process.stdout.write("\n");
  }

  return finalText;
}
