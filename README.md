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

## Project Structure

- `src/index.ts`: CLI entrypoint
- `src/agent.ts`: Claude Agent SDK integration
- `src/system-prompt.ts`: marketing-team system prompt and mode presets
- `src/subagents.ts`: specialist marketing subagents the main agent can delegate to

## Notes

This environment did not have `node` or `npm` installed, so the code was scaffolded but not executed here. After installing Node, run:

```bash
npm install
npm run build
```
