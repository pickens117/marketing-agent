export type WorkflowId =
  | "general"
  | "campaign-brief"
  | "email-sequence-plan"
  | "landing-page-brief"
  | "campaign-postmortem"
  | "content-brief"
  | "sales-enablement-kit"
  | "linkedin-ad-plan"
  | "meta-ad-plan"
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
  "email-sequence-plan": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal", "team"],
    description: "Create a structured email sequence plan with goals, audience logic, message progression, and KPIs.",
    examplePath: "examples/workflows/email-sequence-plan.md",
    followUpWorkflow: "message-house-check",
    sectionTitles: [
      "Objective",
      "Audience",
      "Sequence strategy",
      "Email breakdown",
      "CTA recommendations",
      "Personalization notes",
      "Measurement plan",
      "Risks and review checkpoints"
    ],
    validationRules: [
      "must include multiple emails or stages",
      "must include CTA recommendations",
      "must include a measurement plan"
    ],
    outputContract: `Produce an email sequence plan using markdown headings with these exact titles:
## Objective
## Audience
## Sequence strategy
## Email breakdown
## CTA recommendations
## Personalization notes
## Measurement plan
## Risks and review checkpoints`
  },
  "landing-page-brief": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal", "team"],
    description: "Create a landing page brief with message match, conversion strategy, proof, and CTA guidance.",
    examplePath: "examples/workflows/landing-page-brief.md",
    followUpWorkflow: "message-house-check",
    sectionTitles: [
      "Objective",
      "Audience",
      "Primary message",
      "Page structure",
      "Proof and trust elements",
      "CTA strategy",
      "Conversion risks",
      "Measurement plan"
    ],
    validationRules: [
      "must include page structure",
      "must include CTA strategy",
      "must include proof or trust elements"
    ],
    outputContract: `Produce a landing page brief using markdown headings with these exact titles:
## Objective
## Audience
## Primary message
## Page structure
## Proof and trust elements
## CTA strategy
## Conversion risks
## Measurement plan`
  },
  "campaign-postmortem": {
    contextCategories: ["messaging", "persona", "research", "legal", "team"],
    description: "Create a campaign postmortem that summarizes results, learnings, root causes, and next steps.",
    examplePath: "examples/workflows/campaign-postmortem.md",
    followUpWorkflow: "experiment-plan",
    sectionTitles: [
      "Objective and scope",
      "Performance summary",
      "What worked",
      "What did not work",
      "Root-cause analysis",
      "Recommendations",
      "Follow-up experiments",
      "Owner and next steps"
    ],
    validationRules: [
      "must include performance summary",
      "must include root-cause analysis",
      "must include follow-up experiments or next steps"
    ],
    outputContract: `Produce a campaign postmortem using markdown headings with these exact titles:
## Objective and scope
## Performance summary
## What worked
## What did not work
## Root-cause analysis
## Recommendations
## Follow-up experiments
## Owner and next steps`
  },
  "content-brief": {
    contextCategories: ["brand", "messaging", "persona", "research", "team"],
    description: "Create a content brief with audience, angle, structure, distribution intent, and success measures.",
    examplePath: "examples/workflows/content-brief.md",
    followUpWorkflow: "content-repurpose",
    sectionTitles: [
      "Objective",
      "Audience",
      "Content angle",
      "Key takeaways",
      "Structure or outline",
      "Distribution plan",
      "CTA",
      "Success metrics"
    ],
    validationRules: [
      "must include a content angle",
      "must include structure or outline",
      "must include distribution plan and CTA"
    ],
    outputContract: `Produce a content brief using markdown headings with these exact titles:
## Objective
## Audience
## Content angle
## Key takeaways
## Structure or outline
## Distribution plan
## CTA
## Success metrics`
  },
  "sales-enablement-kit": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal", "team"],
    description: "Create a sales enablement kit with messaging, objection handling, proof points, and talk tracks.",
    examplePath: "examples/workflows/sales-enablement-kit.md",
    followUpWorkflow: "message-house-check",
    sectionTitles: [
      "Objective",
      "Audience or seller context",
      "Core message",
      "Proof points",
      "Objection handling",
      "Talk tracks",
      "Asset recommendations",
      "Enablement next steps"
    ],
    validationRules: [
      "must include proof points",
      "must include objection handling",
      "must include talk tracks or enablement assets"
    ],
    outputContract: `Produce a sales enablement kit using markdown headings with these exact titles:
## Objective
## Audience or seller context
## Core message
## Proof points
## Objection handling
## Talk tracks
## Asset recommendations
## Enablement next steps`
  },
  "linkedin-ad-plan": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal", "team"],
    description: "Create a LinkedIn ad plan with audience, format recommendations, creative angles, copy variants, placement guidance, and measurement guidance.",
    examplePath: "examples/workflows/linkedin-ad-plan.md",
    followUpWorkflow: "experiment-plan",
    sectionTitles: [
      "Objective",
      "Audience",
      "Offer",
      "Recommended formats",
      "Creative angles",
      "Ad copy variants",
      "Placement guidance",
      "CTA recommendations",
      "Measurement plan",
      "Risks and review checkpoints"
    ],
    validationRules: [
      "must include LinkedIn-specific audience framing",
      "must include recommended formats",
      "must include placement guidance",
      "must include multiple ad copy variants",
      "must include a measurement plan and review checkpoints"
    ],
    outputContract: `Produce a LinkedIn ad plan using markdown headings with these exact titles:
## Objective
## Audience
## Offer
## Recommended formats
## Creative angles
## Ad copy variants
## Placement guidance
## CTA recommendations
## Measurement plan
## Risks and review checkpoints`
  },
  "meta-ad-plan": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal", "team"],
    description: "Create a Meta ad plan with audience hypotheses, format recommendations, creative angles, copy variants, placement guidance, and measurement guidance.",
    examplePath: "examples/workflows/meta-ad-plan.md",
    followUpWorkflow: "experiment-plan",
    sectionTitles: [
      "Objective",
      "Audience hypotheses",
      "Offer",
      "Recommended formats",
      "Creative angles",
      "Ad copy variants",
      "Placement guidance",
      "CTA recommendations",
      "Measurement plan",
      "Risks and review checkpoints"
    ],
    validationRules: [
      "must include Meta-friendly audience hypotheses",
      "must include recommended formats",
      "must include placement guidance",
      "must include multiple creative and copy variants",
      "must include a measurement plan and review checkpoints"
    ],
    outputContract: `Produce a Meta ad plan using markdown headings with these exact titles:
## Objective
## Audience hypotheses
## Offer
## Recommended formats
## Creative angles
## Ad copy variants
## Placement guidance
## CTA recommendations
## Measurement plan
## Risks and review checkpoints`
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
