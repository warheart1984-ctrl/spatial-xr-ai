import { residualRiskFromUtterance } from "./residual-risk.js";
import type { AnalystPayload } from "./types.js";

export function buildAnalystPayload(utterance: string): AnalystPayload {
  const { risk, evidence_gaps } = residualRiskFromUtterance(utterance);
  const questions: string[] = [];
  if (risk === null) {
    questions.push("What is likelihood (1–5)?");
    questions.push("What is impact (1–5)?");
    questions.push("What is control effectiveness C_e in [0, 1]?");
  }
  if (!/\bevidence(?:\s+multiplier)?\b|\be_m\b|\bem\b/i.test(utterance)) {
    questions.push("What evidence multiplier E_m in [0, 1] backs the claimed controls?");
  }

  const patterns = detectPatterns(utterance);
  return {
    pattern_recognition: patterns,
    policy_implications: [
      risk === null
        ? "Withhold dispatch until residual risk inputs are complete."
        : risk.fail_closed
          ? "Fail-closed: do not dispatch until escalation and containment owners confirm."
          : "Nominal/review band: log and proceed only with operator approval of listed options.",
    ],
    questions,
    options: [
      "Collect missing evidence and recompute R_r",
      "Accept residual risk explicitly and log the operator decision",
      "Reduce inherent risk (likelihood or impact) before dispatch",
    ],
    evidence_gaps:
      evidence_gaps.length > 0
        ? evidence_gaps
        : /\bevidence(?:\s+multiplier)?\b|\be_m\b|\bem\b/i.test(utterance)
          ? ["R_r computed; index control-evidence artifacts on the ledger"]
          : ["Evidence multiplier defaulted to 1; cite control evidence to set E_m"],
    residual_risk: risk,
  };
}

function detectPatterns(utterance: string): string[] {
  const patterns: string[] = [];
  if (/\bpolic(?:y|ies)\b/i.test(utterance)) {
    patterns.push("Policy-language pattern present");
  }
  if (/\bpatterns?\b/i.test(utterance)) {
    patterns.push("Operator requested pattern analysis");
  }
  if (/\brisks?\b|\br_r\b|\bresidual\b/i.test(utterance)) {
    patterns.push("Residual-risk evaluation requested");
  }
  if (/\booda\b|\bstrategic\b/i.test(utterance)) {
    patterns.push("Strategic/OODA loop framing present");
  }
  if (patterns.length === 0) {
    patterns.push("Broad systemic query; no Equalizer tactical markers");
  }
  return patterns;
}
