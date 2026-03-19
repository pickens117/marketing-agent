import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { runMarketingAgent } from "./agent.js";
import type { AgentMode } from "./system-prompt.js";

type CliOptions = {
  interactive: boolean;
  mode: AgentMode;
  prompt: string;
};

function parseArgs(argv: string[]): CliOptions {
  let interactive = false;
  let mode: AgentMode = "coach";
  const promptParts: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--interactive") {
      interactive = true;
      continue;
    }

    if (arg === "--mode") {
      const value = argv[index + 1];
      if (value === "coach" || value === "campaign" || value === "workflow") {
        mode = value;
        index += 1;
        continue;
      }

      throw new Error("Expected --mode to be one of: coach, campaign, workflow.");
    }

    promptParts.push(arg);
  }

  return {
    interactive,
    mode,
    prompt: promptParts.join(" ").trim()
  };
}

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

async function runInteractive(mode: AgentMode): Promise<void> {
  const rl = createInterface({ input, output });
  let continueSession = false;

  output.write(`Marketing agent started in ${mode} mode.\n`);
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
      continueSession,
      mode,
      prompt: answer
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
    await runInteractive(options.mode);
    return;
  }

  if (!prompt) {
    throw new Error("Provide a prompt as an argument or pipe one in through stdin.");
  }

  await runMarketingAgent({
    mode: options.mode,
    prompt
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
