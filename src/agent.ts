import { query } from "@anthropic-ai/claude-agent-sdk";
import { loadCompanyContext } from "./context.js";
import { buildSubagents } from "./subagents.js";
import { buildSystemPrompt, type AgentMode } from "./system-prompt.js";

export type RunAgentOptions = {
  continueSession?: boolean;
  mode: AgentMode;
  prompt: string;
};

export async function runMarketingAgent({
  continueSession = false,
  mode,
  prompt
}: RunAgentOptions): Promise<string> {
  let finalText = "";
  const companyContext = await loadCompanyContext();

  for await (const message of query({
    prompt,
    options: {
      continue: continueSession,
      tools: ["WebSearch"],
      maxTurns: 8,
      permissionMode: "dontAsk",
      systemPrompt: buildSystemPrompt(mode, companyContext),
      allowedTools: ["WebSearch"],
      agents: buildSubagents(mode)
    }
  })) {
    if (message.type === "assistant") {
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

  if (!finalText) {
    process.stdout.write("\n");
  }

  return finalText;
}
