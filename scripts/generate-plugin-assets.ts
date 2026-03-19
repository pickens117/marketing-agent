import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  bulletList,
  sharedContextRules,
  sharedMission,
  sharedOperatingPrinciples,
  sharedQualityBar,
  sharedResponseStyle,
  skillUseCases
} from "../src/prompt-content.js";

const pluginDir = path.resolve(process.cwd(), "plugins/marketing-ai-enablement-plugin");

function buildAgentMarkdown(): string {
  return `---
name: marketing-ai-enablement
description: Helps marketing teams use AI effectively for campaign strategy, content planning, workflow design, prompt improvement, and team enablement.
tools: WebSearch
---

${sharedMission}

Before giving company-specific recommendations, review \`docs/company/company-context.md\` in the user's project if it exists.

If company context is available:

${bulletList(sharedContextRules.available)}

If company context is missing:

${bulletList(sharedContextRules.missing)}

Operating principles:

${bulletList(sharedOperatingPrinciples)}

How to respond:

${bulletList(sharedResponseStyle)}

You are not just a copywriter. You are a strategic marketing operator helping teams adopt AI in ways that improve execution without weakening judgment or brand trust.
`;
}

function buildSkillMarkdown(): string {
  return `# Marketing AI Enablement

Use this skill when the task involves helping a marketing team use AI effectively for planning, execution, enablement, or operational design.

## Use This For

${bulletList(skillUseCases)}

## Company Context

Before giving company-specific recommendations, review \`docs/company/company-context.md\` in the user's project if it exists.

If company context is available:

${bulletList(sharedContextRules.available.map((item) =>
    item.replace("project files", "files in `docs/company/`")
  ))}

If company context is missing:

${bulletList(sharedContextRules.missing)}

## Core Behavior

${bulletList(sharedOperatingPrinciples)}

## Response Shape

When useful, structure responses as:

1. Objective
2. Assumptions
3. Recommended approach
4. Draft prompts, assets, or workflow steps
5. Metrics and next actions

## Quality Bar

${bulletList(sharedQualityBar)}

## Example Requests

- Help our content team build an AI-assisted blog repurposing workflow.
- Improve this webinar promo prompt so it produces better LinkedIn copy.
- Create a lightweight AI governance checklist for marketing.
- Design a pilot plan for using AI in demand generation without harming brand quality.
`;
}

async function main(): Promise<void> {
  const agentPath = path.join(pluginDir, "agents/marketing-ai-enablement.md");
  const skillPath = path.join(pluginDir, "skills/marketing-ai-enablement/SKILL.md");

  await mkdir(path.dirname(agentPath), { recursive: true });
  await mkdir(path.dirname(skillPath), { recursive: true });
  await writeFile(agentPath, buildAgentMarkdown(), "utf8");
  await writeFile(skillPath, buildSkillMarkdown(), "utf8");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
