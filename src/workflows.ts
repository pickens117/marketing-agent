export type WorkflowId =
  | "general"
  | "campaign-brief"
  | "message-house-check"
  | "content-repurpose"
  | "experiment-plan"
  | "ai-governance-checklist"
  | "ai-adoption-plan";

export type ContextCategory =
  | "general"
  | "brand"
  | "messaging"
  | "persona"
  | "research"
  | "legal"
  | "governance";

export type WorkflowDefinition = {
  contextCategories: ContextCategory[];
  description: string;
  outputContract: string;
  sectionTitles: string[];
};

const workflowDefinitions: Record<WorkflowId, WorkflowDefinition> = {
  general: {
    contextCategories: ["general", "brand", "messaging", "persona", "research", "legal", "governance"],
    description: "General marketing AI enablement support.",
    sectionTitles: ["Objective", "Assumptions", "Recommended approach", "Next actions"],
    outputContract: `Use the response shape that best fits the request.

At minimum include markdown headings with these exact titles:
## Objective
## Assumptions
## Recommended approach
## Next actions`
  },
  "campaign-brief": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal"],
    description: "Create a structured campaign brief grounded in audience, messaging, and business outcomes.",
    sectionTitles: [
      "Objective",
      "Audience",
      "Key message",
      "Offer or CTA",
      "Channel plan",
      "Content assets needed",
      "Risks and review checkpoints",
      "KPIs",
      "Recommended next actions"
    ],
    outputContract: `Produce a campaign brief using markdown headings with these exact titles:
## Objective
## Audience
## Key message
## Offer or CTA
## Channel plan
## Content assets needed
## Risks and review checkpoints
## KPIs
## Recommended next actions`
  },
  "message-house-check": {
    contextCategories: ["brand", "messaging", "persona", "legal"],
    description: "Evaluate or improve messaging against the company's message house and positioning.",
    sectionTitles: [
      "Message being evaluated",
      "Alignment with approved positioning",
      "Audience fit",
      "Brand voice issues",
      "Risky or unsupported claims",
      "Recommended rewrite",
      "Approval notes"
    ],
    outputContract: `Produce a messaging review using markdown headings with these exact titles:
## Message being evaluated
## Alignment with approved positioning
## Audience fit
## Brand voice issues
## Risky or unsupported claims
## Recommended rewrite
## Approval notes`
  },
  "content-repurpose": {
    contextCategories: ["brand", "messaging", "persona", "research"],
    description: "Turn an approved source asset or idea into a distribution-aware repurposing plan.",
    sectionTitles: [
      "Source asset summary",
      "Audience and channel targets",
      "Repurposed asset ideas",
      "Suggested prompts or briefs",
      "Review checkpoints",
      "Success metrics"
    ],
    outputContract: `Produce a repurposing plan using markdown headings with these exact titles:
## Source asset summary
## Audience and channel targets
## Repurposed asset ideas
## Suggested prompts or briefs
## Review checkpoints
## Success metrics`
  },
  "experiment-plan": {
    contextCategories: ["messaging", "persona", "research", "legal"],
    description: "Design an experiment plan with hypotheses, success metrics, and decision thresholds.",
    sectionTitles: [
      "Objective",
      "Hypothesis",
      "Test design",
      "Audience and channel",
      "Variants",
      "Metrics and thresholds",
      "Risks and confounders",
      "Decision rule"
    ],
    outputContract: `Produce an experiment plan using markdown headings with these exact titles:
## Objective
## Hypothesis
## Test design
## Audience and channel
## Variants
## Metrics and thresholds
## Risks and confounders
## Decision rule`
  },
  "ai-governance-checklist": {
    contextCategories: ["brand", "legal", "governance"],
    description: "Create a practical governance checklist for safe AI-assisted marketing execution.",
    sectionTitles: [
      "Scope",
      "Allowed use cases",
      "Human review checkpoints",
      "Claim and compliance checks",
      "Data handling rules",
      "Escalation triggers",
      "Audit or documentation requirements"
    ],
    outputContract: `Produce a governance checklist using markdown headings with these exact titles:
## Scope
## Allowed use cases
## Human review checkpoints
## Claim and compliance checks
## Data handling rules
## Escalation triggers
## Audit or documentation requirements`
  },
  "ai-adoption-plan": {
    contextCategories: ["brand", "messaging", "legal", "governance", "research"],
    description: "Create a practical rollout plan for AI adoption within a marketing team.",
    sectionTitles: [
      "Objective",
      "Current-state assumptions",
      "Best initial use cases",
      "Recommended workflow changes",
      "Roles and responsibilities",
      "Prompting and QA guidance",
      "Governance and risk controls",
      "Enablement and training plan",
      "Success metrics",
      "30-day rollout plan"
    ],
    outputContract: `Produce an AI adoption plan using markdown headings with these exact titles:
## Objective
## Current-state assumptions
## Best initial use cases
## Recommended workflow changes
## Roles and responsibilities
## Prompting and QA guidance
## Governance and risk controls
## Enablement and training plan
## Success metrics
## 30-day rollout plan`
  }
};

export function getWorkflowDefinition(workflow: WorkflowId): WorkflowDefinition {
  return workflowDefinitions[workflow];
}

export function isWorkflowId(value: string): value is WorkflowId {
  return value in workflowDefinitions;
}

export function listWorkflowIds(): WorkflowId[] {
  return Object.keys(workflowDefinitions) as WorkflowId[];
}
