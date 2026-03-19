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
};

const workflowDefinitions: Record<WorkflowId, WorkflowDefinition> = {
  general: {
    contextCategories: ["general", "brand", "messaging", "persona", "research", "legal", "governance"],
    description: "General marketing AI enablement support.",
    outputContract: `Use the response shape that best fits the request.

At minimum include:
1. Objective
2. Assumptions
3. Recommended approach
4. Next actions`
  },
  "campaign-brief": {
    contextCategories: ["brand", "messaging", "persona", "research", "legal"],
    description: "Create a structured campaign brief grounded in audience, messaging, and business outcomes.",
    outputContract: `Produce a campaign brief with these sections:
1. Objective
2. Audience
3. Key message
4. Offer or CTA
5. Channel plan
6. Content assets needed
7. Risks and review checkpoints
8. KPIs
9. Recommended next actions`
  },
  "message-house-check": {
    contextCategories: ["brand", "messaging", "persona", "legal"],
    description: "Evaluate or improve messaging against the company's message house and positioning.",
    outputContract: `Produce a messaging review with these sections:
1. Message being evaluated
2. Alignment with approved positioning
3. Audience fit
4. Brand voice issues
5. Risky or unsupported claims
6. Recommended rewrite
7. Approval notes`
  },
  "content-repurpose": {
    contextCategories: ["brand", "messaging", "persona", "research"],
    description: "Turn an approved source asset or idea into a distribution-aware repurposing plan.",
    outputContract: `Produce a repurposing plan with these sections:
1. Source asset summary
2. Audience and channel targets
3. Repurposed asset ideas
4. Suggested prompts or briefs
5. Review checkpoints
6. Success metrics`
  },
  "experiment-plan": {
    contextCategories: ["messaging", "persona", "research", "legal"],
    description: "Design an experiment plan with hypotheses, success metrics, and decision thresholds.",
    outputContract: `Produce an experiment plan with these sections:
1. Objective
2. Hypothesis
3. Test design
4. Audience and channel
5. Variants
6. Metrics and thresholds
7. Risks and confounders
8. Decision rule`
  },
  "ai-governance-checklist": {
    contextCategories: ["brand", "legal", "governance"],
    description: "Create a practical governance checklist for safe AI-assisted marketing execution.",
    outputContract: `Produce a governance checklist with these sections:
1. Scope
2. Allowed use cases
3. Human review checkpoints
4. Claim and compliance checks
5. Data handling rules
6. Escalation triggers
7. Audit or documentation requirements`
  },
  "ai-adoption-plan": {
    contextCategories: ["brand", "messaging", "legal", "governance", "research"],
    description: "Create a practical rollout plan for AI adoption within a marketing team.",
    outputContract: `Produce an AI adoption plan with these sections:
1. Objective
2. Current-state assumptions
3. Best initial use cases
4. Recommended workflow changes
5. Roles and responsibilities
6. Prompting and QA guidance
7. Governance and risk controls
8. Enablement and training plan
9. Success metrics
10. 30-day rollout plan`
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
