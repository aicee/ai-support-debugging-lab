export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Difficulty = "Foundational" | "Operational" | "Escalation";

export interface TimelineEvent { time: string; event: string }
export interface InvestigationSummary {
  rootCause: string;
  evidence: string[];
  impact: string;
  resolution: string;
}

export interface CustomerContext {
  customer: string;
  plan: string;
  environment: string;
  affectedUsers: string;
  region: string;
  started: string;
}

export interface BusinessImpact {
  serviceImpact: string;
  estimatedAffectedUsers: string;
  businessImpact: string;
  priority: string;
  revenueImpact: string;
}

export interface Incident {
  id: string;
  incidentId: string;
  title: string;
  product: string;
  severity: Severity;
  category: string;
  difficulty: Difficulty;
  level: Difficulty;
  status: "Open";
  error: string;
  customerMessage: string;
  customerImpact: string;
  customerContext: CustomerContext;
  businessImpact: BusinessImpact;
  logs: string;
  apiRequest?: string;
  apiResponse?: string;
  requestDetails?: string;
  observedError?: string;
  deploymentDetails: string;
  environmentDetails: string;
  timeline: TimelineEvent[];
  notes: string;
  choices: string[];
  correctAnswer: number;
  wrongAnswerHint?: string;
  suggestedReviewTabs?: string[];
  explanation: string;
  investigationSummary: InvestigationSummary;
  prevention: string;
  customerFriendlyReply: string;
  diagnosticProvider?: "elevenlabs" | "openai";
}
