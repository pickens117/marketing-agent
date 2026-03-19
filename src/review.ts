import type { WorkflowId } from "./workflows.js";
import { getWorkflowDefinition } from "./workflows.js";

export function buildReviewPrompt(workflow: WorkflowId, content: string): string {
  const definition = getWorkflowDefinition(workflow);

  return `Review the following ${workflow} output against its expected structure and quality bar.

Workflow description:
${definition.description}

Required section titles:
${definition.sectionTitles.map((title) => `- ${title}`).join("\n")}

Review goals:
- confirm all required sections are present
- flag unsupported claims, weak reasoning, or vague next steps
- note missing metrics, thresholds, CTAs, or approval guidance when relevant
- keep the review concise and actionable

Content to review:

${content}`;
}
