export const ROUTER_VERSION = "v0" as const;
export const LEDGER_SCHEMA_VERSION = "spatial-xr-ledger-v0" as const;
export const TONE_LAW_ID = "EMPOWERMENT_FIRST_CHECKLIST" as const;

export type TargetFront = "LINGUISTIC_EQUALIZER" | "SYSTEMIC_ANALYST";
export type HandoffToken = "EQUALIZER_TACTICAL_V1" | "ANALYST_SYSTEMIC_V1";
export type ToneLawId = typeof TONE_LAW_ID;
export type RiskBand = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type UiIndicator = "SAGE_GREEN" | "SLATE_BLUE" | "AMBER" | "DEEP_RED";
export type RiskActionCode =
  | "STANDARD_LOGGING"
  | "MANUAL_REVIEW"
  | "FAIL_CLOSED_ESCALATE"
  | "CONTAINMENT_HALT";

export type RoutingDecision = {
  target_front: TargetFront;
  handoff_token: HandoffToken;
  trigger_reason: string;
  injected_tone_law: ToneLawId;
};

export type RouterTrace = {
  router_version: typeof ROUTER_VERSION;
  matched_equalizer_keywords: string[];
  matched_analyst_keywords: string[];
  matched_handoff_token: HandoffToken | null;
  visual_handoff: "VISUAL_HANDOFF_V1" | null;
  rule_id: string;
};

export type EqualizerPayload = {
  threat_decode: string;
  negotiation_plan: string[];
  counter_framing: string;
  evidence_gaps: string[];
};

export type ResidualRisk = {
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  inherent_risk: number;
  control_effectiveness: number;
  evidence_multiplier: number;
  formula: "R_r = inherent_risk * (1 - control_effectiveness * evidence_multiplier)";
  r_r: number;
  band: RiskBand;
  severity: string;
  ui_indicator: UiIndicator;
  action_required: string;
  action_code: RiskActionCode;
  fail_closed: boolean;
};

export type AnalystPayload = {
  pattern_recognition: string[];
  policy_implications: string[];
  questions: string[];
  options: string[];
  evidence_gaps: string[];
  residual_risk: ResidualRisk | null;
};

export type EqualizerArtifact = {
  kind: "equalizer_payload";
  equalizer_payload: EqualizerPayload;
};

export type AnalystArtifact = {
  kind: "analyst_payload";
  analyst_payload: AnalystPayload;
};

export type StructuredArtifact = EqualizerArtifact | AnalystArtifact;

export type LedgerEntry = {
  schema_version: typeof LEDGER_SCHEMA_VERSION;
  entry_id: string;
  recorded_at: string;
  utterance_hash: string;
  routing_decision: RoutingDecision;
  router_trace: RouterTrace;
  artifact: StructuredArtifact;
  residual_risk: ResidualRisk | null;
};

export type PipelineResult = {
  routing_decision: RoutingDecision;
  router_trace: RouterTrace;
  artifact: StructuredArtifact;
  residual_risk: ResidualRisk | null;
  ledger_entry: LedgerEntry;
};
