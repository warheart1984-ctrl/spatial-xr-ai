import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { runPipeline } from "./pipeline.js";
import { isEqualizerPayload } from "./equalizer.js";

describe("utterance → router → artifact → ledger", () => {
  it("writes an Equalizer JSON artifact and a ledger row without mixing R_r", () => {
    const ledgerPath = join(mkdtempSync(join(tmpdir(), "spatial-xr-")), "ledger.jsonl");
    const result = runPipeline(
      "Refuse this high-pressure negotiation deadline and request a written breakdown.",
      {
        ledgerPath,
        entryId: "test-eq-1",
        now: new Date("2026-09-02T12:00:00.000Z"),
      },
    );
    assert.equal(result.routing_decision.target_front, "LINGUISTIC_EQUALIZER");
    assert.equal(result.artifact.kind, "equalizer_payload");
    if (result.artifact.kind !== "equalizer_payload") {
      throw new Error("expected equalizer artifact");
    }
    assert.equal(true, isEqualizerPayload(result.artifact.equalizer_payload));
    assert.equal(result.residual_risk, null);

    const line = readFileSync(ledgerPath, "utf8").trim();
    const entry = JSON.parse(line) as { entry_id: string; residual_risk: null };
    assert.equal(entry.entry_id, "test-eq-1");
    assert.equal(entry.residual_risk, null);
  });

  it("computes R_r on the Analyst front and persists it on the ledger entry", () => {
    const ledgerPath = join(mkdtempSync(join(tmpdir(), "spatial-xr-")), "ledger.jsonl");
    const result = runPipeline(
      "Systemic residual risk dashboard: likelihood 5 impact 5 c_e 0.2 e_m 1",
      { ledgerPath, entryId: "test-an-1" },
    );
    assert.equal(result.routing_decision.target_front, "SYSTEMIC_ANALYST");
    assert.equal(result.artifact.kind, "analyst_payload");
    assert.equal(result.residual_risk?.inherent_risk, 25);
    assert.equal(result.residual_risk?.r_r, 20);
    assert.equal(result.residual_risk?.band, "HIGH");
    assert.equal(true, result.residual_risk?.fail_closed);

    const entry = JSON.parse(readFileSync(ledgerPath, "utf8").trim()) as {
      residual_risk: { r_r: number };
    };
    assert.equal(entry.residual_risk.r_r, 20);
  });
});
