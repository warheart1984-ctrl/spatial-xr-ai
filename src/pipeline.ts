import { randomUUID } from "node:crypto";
import { assertNever } from "./assert-never.js";
import { buildAnalystPayload } from "./analyst.js";
import { buildEqualizerPayload } from "./equalizer.js";
import { appendLedger, makeLedgerEntry, utteranceHash } from "./ledger.js";
import { routeUtterance } from "./router.js";
import type {
  PipelineResult,
  ResidualRisk,
  StructuredArtifact,
} from "./types.js";

export type PipelineOptions = {
  ledgerPath?: string;
  now?: Date;
  entryId?: string;
};

export function runPipeline(
  utterance: string,
  options: PipelineOptions = {},
): PipelineResult {
  const { routing_decision, router_trace } = routeUtterance(utterance);
  const artifact = buildArtifact(routing_decision.target_front, utterance);
  const residual_risk = residualRiskFromArtifact(artifact);
  const ledger_entry = makeLedgerEntry({
    entry_id: options.entryId ?? randomUUID(),
    recorded_at: (options.now ?? new Date()).toISOString(),
    utterance_hash: utteranceHash(utterance),
    routing_decision,
    router_trace,
    artifact,
    residual_risk,
  });

  if (options.ledgerPath !== undefined) {
    appendLedger(options.ledgerPath, ledger_entry);
  }

  return {
    routing_decision,
    router_trace,
    artifact,
    residual_risk,
    ledger_entry,
  };
}

function buildArtifact(
  front: PipelineResult["routing_decision"]["target_front"],
  utterance: string,
): StructuredArtifact {
  switch (front) {
    case "LINGUISTIC_EQUALIZER":
      return {
        kind: "equalizer_payload",
        equalizer_payload: buildEqualizerPayload(utterance),
      };
    case "SYSTEMIC_ANALYST":
      return {
        kind: "analyst_payload",
        analyst_payload: buildAnalystPayload(utterance),
      };
    default:
      return assertNever(front);
  }
}

function residualRiskFromArtifact(
  artifact: StructuredArtifact,
): ResidualRisk | null {
  switch (artifact.kind) {
    case "equalizer_payload":
      return null;
    case "analyst_payload":
      return artifact.analyst_payload.residual_risk;
    default:
      return assertNever(artifact);
  }
}
