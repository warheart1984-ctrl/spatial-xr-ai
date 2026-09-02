import type { EqualizerPayload } from "./types.js";

const SPEED =
  /\b(?:deadline|immediately|today|now|urgent|asap|limited time|before you think|sign today)\b/i;
const AUTHORITY =
  /\b(?:contract|unsigned|clause|compliance|must sign|authority|policy says)\b/i;
const COST = /\b(?:cost|price|invoice|itemized|breakdown|fee)\b/i;
const HASH = /\b(?:hash|checksum|signature|signed|attest)\b/i;

export function buildEqualizerPayload(utterance: string): EqualizerPayload {
  return {
    threat_decode: decodeThreat(utterance),
    negotiation_plan: planNegotiation(utterance),
    counter_framing: counterFrame(utterance),
    evidence_gaps: detectEvidenceGaps(utterance),
  };
}

function decodeThreat(utterance: string): string {
  if (SPEED.test(utterance)) {
    return "Entity attempting high-pressure asymmetry via artificial deadline.";
  }
  if (AUTHORITY.test(utterance)) {
    return "Entity leveraging document or authority asymmetry.";
  }
  return "Interpersonal/tactical pressure detected; operator retains decision rights.";
}

function planNegotiation(utterance: string): string[] {
  const plan: string[] = [];
  if (SPEED.test(utterance)) {
    plan.push("Refusal of speed tactic");
  }
  plan.push("Request written breakdown");
  if (AUTHORITY.test(utterance)) {
    plan.push("Separate rhetorical pressure from documented terms");
  }
  plan.push("Close evidence gaps before committing");
  return plan;
}

function counterFrame(utterance: string): string {
  if (SPEED.test(utterance)) {
    return "Shift focus from compliance speed to verifiable accuracy.";
  }
  return "Shift focus from rhetorical pressure to documented facts and operator-chosen options.";
}

function detectEvidenceGaps(utterance: string): string[] {
  const gaps: string[] = [];
  if (COST.test(utterance) || SPEED.test(utterance)) {
    gaps.push("Missing itemized cost sheet");
  }
  if (AUTHORITY.test(utterance) || HASH.test(utterance) || /contract/i.test(utterance)) {
    gaps.push("Unverified contract hash");
  }
  if (gaps.length === 0) {
    gaps.push("No attached evidence artifact; claims remain unverified");
  }
  return gaps;
}

export function isEqualizerPayload(value: unknown): value is EqualizerPayload {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.threat_decode === "string" &&
    record.threat_decode.length > 0 &&
    Array.isArray(record.negotiation_plan) &&
    record.negotiation_plan.every((item) => typeof item === "string") &&
    record.negotiation_plan.length > 0 &&
    typeof record.counter_framing === "string" &&
    record.counter_framing.length > 0 &&
    Array.isArray(record.evidence_gaps) &&
    record.evidence_gaps.every((item) => typeof item === "string") &&
    record.evidence_gaps.length > 0
  );
}
