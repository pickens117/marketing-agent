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
  | "governance"
  | "team";

export type WorkflowDefinition = {
  examplePath?: string;
  followUpWorkflow?: WorkflowId;
  contextCategories: ContextCategory[];
  description: string;
  outputContract: string;
  sectionTitles: string[];
  validationRules: string[];
};

const workflowDefinitions: Record<WorkflowId, WorkflowDefinition> = {
  general: {
    contextCategories: ["general", "brand", "messaging", "persona", "research", "legal", "governance", "team"],
    description: "General marketing AI enablement support.",
    examplePath: "examples/workflows/campaign-brief.md",
    followUpWorkflow: "message-house-check",
    sectionTitles: ["Objective", "Assumptions", "Recommended approach", "Next actions"],
    validationRules: [
      "must include a clear objective",
      "must call out assumptions when context is missing",
      "must end with actionable next steps"
    ],
    outputContract: `Use the response shape that best fits the request.

At minimum include markdown headings with these exact titles:
## Objective
## Assumptions
## Recommended approach
## Next actions`
  },
  "campaign-brief": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal", "team"],
    description: "Create a structured campaign brief grounded in audience, messaging, and business outcomes.",
    examplePath: "examples/workflows/campaign-brief.md",
    followUpWorkflow: "message-house-check",
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
    validationRules: [
      "must include a CTA or offer",
      "must include KPIs",
      "must include risks or review checkpoints"
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
    contextCategories: ["brand", "messaging", "persona", "legal", "team"],
    description: "Evaluate or improve messaging against the company's message house and positioning.",
    followUpWorkflow: "experiment-plan",
    sectionTitles: [
      "Message being evaluated",
      "Alignment with approved positioning",
      "Audience fit",
      "Brand voice issues",
      "Risky or unsupported claims",
      "Recommended rewrite",
      "Approval notes"
    ],
    validationRules: [
      "must flag unsupported claims",
      "must provide a rewrite",
      "must say if human review is required"
    ],
    outputContract: `Produce a messaging review using markdown headings with these exact titles:
## Message being evaluated
## Alignment with approved positioning
## Audience fit
## Brand voice issues
## Risky or unsupported claims
## Recommended rewrite
## Approval notes

In Approval notes, explicitly state whether human review is required before the message can be used.`
  },
  "content-repurpose": {
    contextCategories: ["brand", "messaging", "persona", "research", "team"],
    description: "Turn an approved source asset or idea into a distribution-aware repurposing plan.",
    followUpWorkflow: "experiment-plan",
    sectionTitles: [
      "Source asset summary",
      "Audience and channel targets",
      "Repurposed asset ideas",
      "Suggested prompts or briefs",
      "Review checkpoints",
      "Success metrics"
    ],
    validationRules: [
      "must target channels",
      "must include review checkpoints",
      "must include success metrics"
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
    contextCategories: ["messaging", "persona", "research", "legal", "team"],
    description: "Design an experiment plan with hypotheses, success metrics, and decision thresholds.",
    examplePath: "examples/workflows/experiment-plan.md",
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
    validationRules: [
      "must include a hypothesis",
      "must include thresholds",
      "must include a decision rule"
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
    contextCategories: ["brand", "legal", "governance", "team"],
    description: "Create a practical governance checklist for safe AI-assisted marketing execution.",
    followUpWorkflow: "ai-adoption-plan",
    sectionTitles: [
      "Scope",
      "Allowed use cases",
      "Human review checkpoints",
      "Claim and compliance checks",
      "Data handling rules",
      "Escalation triggers",
      "Audit or documentation requirements"
    ],
    validationRules: [
      "must include data handling rules",
      "must include escalation triggers",
      "must include human review checkpoints"
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
    contextCategories: ["brand", "messaging", "legal", "governance", "research", "team"],
    description: "Create a practical rollout plan for AI adoption within a marketing team.",
    examplePath: "examples/workflows/ai-adoption-plan.md",
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
    validationRules: [
      "must include best initial use cases",
      "must include success metrics",
      "must include a 30-day rollout plan"
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
