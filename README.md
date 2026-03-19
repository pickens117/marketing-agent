# Marketing Agent

A Claude Agent SDK starter built for marketing teams that want practical help using AI effectively.

The agent is tuned to support:

- campaign ideation and positioning
- audience and message refinement
- content planning and repurposing
- experimentation frameworks and measurement
- workflow design for safe, repeatable AI use
- review of prompts, briefs, and go-to-market plans

## What It Does

This project provides a small TypeScript CLI around the Claude Agent SDK. It gives your team a reusable marketing-focused agent instead of starting every session from a blank prompt.

The default behavior is opinionated:

- pushes for business context before generating tactics
- recommends experiments, not just copy
- calls out brand, legal, and data-quality risks
- prefers measurable next steps over generic AI advice
- can delegate to built-in specialist subagents for strategy, content, analytics, and enablement ops

## Setup

1. Install Node.js 18 or newer.
2. Install dependencies:

```bash
npm install
```

3. Set your Anthropic API key:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Run It

Use a one-off prompt:

```bash
npm run agent -- "Create a Q2 launch plan for a new B2B analytics product aimed at VP Marketing."
```

Start interactive mode:

```bash
npm run chat
```

Use a built-in workflow:

```bash
npm run agent -- --mode workflow "Help our demand gen team build an AI-assisted webinar promotion workflow."
```

## Modes

- `coach`: default mode for broad marketing guidance
- `campaign`: sharper campaign strategy and messaging support
- `workflow`: focused on AI process design, tooling, and enablement

## Output Style

The agent is instructed to produce:

- concise recommendations
- assumptions called out explicitly
- suggested prompts or templates when useful
- experiments, KPIs, and next steps

## Subagents

The main agent can delegate to specialist subagents when a task needs deeper support in a specific area:

- `strategist`: campaign strategy, audience selection, positioning, offer design, and messaging architecture
- `content_lead`: content planning, repurposing ideas, editorial angles, and prompt-ready creative briefs
- `analyst`: measurement plans, funnel diagnostics, testing frameworks, and campaign performance interpretation
- `enablement_ops`: AI workflow design, governance, prompt libraries, QA checklists, and team enablement programs

If you are using Claude Code in this repo, the project also includes a shared marketing subagent:

- `marketing-ai-enablement`: a Claude project subagent focused on helping marketing teams use AI effectively for campaign strategy, content planning, workflow design, prompt improvement, and team enablement

## Company Context

This project is structured so the marketing agent stays reusable, while company-specific context lives in separate files.

The main entrypoint is:

- `docs/company/company-context.md`

That file should summarize the company and point to supporting materials such as:

- `docs/company/brand-guidelines.md`
- `docs/company/message-house.md`
- `docs/company/personas.md`
- `docs/company/research-summary.md`
- `docs/company/legal-constraints.md`

The Node agent will load `docs/company/company-context.md` automatically when it exists and use it to ground recommendations in the company's brand voice, messaging, audience, and constraints.

The Claude Code skill is also written to look for that file before giving company-specific guidance.

## Share With Claude CLI Users

This repo now includes a Claude Code plugin marketplace and a reusable plugin:

- marketplace file: `.claude-plugin/marketplace.json`
- plugin: `plugins/marketing-ai-enablement-plugin`

To test locally:

```bash
claude --plugin-dir ./plugins/marketing-ai-enablement-plugin
```

To add the local marketplace and install the plugin from Claude Code:

```text
/plugin marketplace add .
/plugin install marketing-ai-enablement-plugin@marketing-agent-marketplace
```

To share it with others, publish this repository to GitHub and tell users to run:

```text
/plugin marketplace add pickens117/marketing-agent
/plugin install marketing-ai-enablement-plugin@marketing-agent-marketplace
```

After installation, users can invoke the plugin's agent, use its slash commands, or let Claude use the skill when tasks match.

Included plugin commands:

- `/campaign-brief`: generates a structured marketing campaign brief
- `/ai-adoption-plan`: creates a practical AI rollout plan for a marketing team

## Example Workflow

Here is one practical way a marketing team could use the agent for a new campaign:

1. Start in `campaign` mode and ask for the launch strategy.

```bash
npm run agent -- --mode campaign "We are launching a new AI analytics feature for B2B SaaS marketers. Create a campaign strategy for pipeline generation."
```

2. Use the output to refine positioning, audience segments, channels, and success metrics.

3. Ask the agent to develop content angles and assets.

```bash
npm run agent -- --mode campaign "Using that strategy, create three webinar angles, five LinkedIn post concepts, and an email sequence outline."
```

4. Switch to `workflow` mode to design the team process for producing and reviewing AI-assisted content.

```bash
npm run agent -- --mode workflow "Create a lightweight workflow for drafting, reviewing, and approving AI-assisted campaign content across demand gen and content marketing."
```

5. Use the recommendations to create a repeatable operating playbook with prompts, QA checks, owners, and KPIs.

If you are using Claude Code instead of the Node CLI, you can also work through the same flow by invoking the project subagent directly:

```text
Use the marketing-ai-enablement subagent to help me build a campaign launch plan and an AI-assisted content workflow for the team.
```

## Project Structure

- `src/index.ts`: CLI entrypoint
- `src/agent.ts`: Claude Agent SDK integration
- `src/system-prompt.ts`: marketing-team system prompt and mode presets
- `src/subagents.ts`: specialist marketing subagents the main agent can delegate to

## Notes

The project has been installed and verified with:

```bash
npm install
npm run build
```
