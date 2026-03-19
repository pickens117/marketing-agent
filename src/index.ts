import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { runMarketingAgent } from "./agent.js";
import { defaultContextPath } from "./context.js";
import { formatAgentOutput, parseArgs } from "./cli.js";
import type { AgentMode } from "./system-prompt.js";
import type { WorkflowId } from "./workflows.js";

async function readPromptFromStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return "";
  }

  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8").trim();
}

async function runInteractive(
  mode: AgentMode,
  workflow: WorkflowId,
  contextPath?: string
): Promise<void> {
  const rl = createInterface({ input, output });
  let continueSession = false;

  output.write(`Marketing agent started in ${mode} mode.\n`);
  output.write(`Workflow pack: ${workflow}\n`);
  output.write("Type a request and press enter. Type exit to quit.\n\n");

  while (true) {
    const answer = (await rl.question("> ")).trim();

    if (!answer) {
      continue;
    }

    if (answer.toLowerCase() === "exit") {
      break;
    }

    output.write("\n");
    await runMarketingAgent({
      contextPath,
      continueSession,
      mode,
      prompt: answer,
      workflow
    });
    continueSession = true;
    output.write("\n\n");
  }

  rl.close();
}

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY. Set it in your environment or .env file.");
  }

  const options = parseArgs(process.argv.slice(2));
  const pipedPrompt = await readPromptFromStdin();
  const prompt = options.prompt || pipedPrompt;

  if (options.interactive) {
    await runInteractive(options.mode, options.workflow, options.contextPath);
    return;
  }

  if (!prompt) {
    throw new Error("Provide a prompt as an argument or pipe one in through stdin.");
  }

  const response = await runMarketingAgent({
    contextPath: options.contextPath,
    mode: options.mode,
    prompt,
    stream: options.output !== "json",
    workflow: options.workflow
  });

  if (options.output === "json") {
    process.stdout.write(
      `${formatAgentOutput({
        contextPath: options.contextPath ?? defaultContextPath,
        mode: options.mode,
        output: options.output,
        response,
        workflow: options.workflow
      })}\n`
    );
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
