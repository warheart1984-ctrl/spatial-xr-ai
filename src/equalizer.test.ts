import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEqualizerPayload, isEqualizerPayload } from "./equalizer.js";

describe("equalizer payload", () => {
  it("emits the strict actionable schema for a speed-tactic utterance", () => {
    const payload = buildEqualizerPayload(
      "They are pushing an artificial deadline and want us to sign the contract today without an itemized cost sheet.",
    );
    assert.equal(
      payload.threat_decode,
      "Entity attempting high-pressure asymmetry via artificial deadline.",
    );
    assert.ok(payload.negotiation_plan.includes("Refusal of speed tactic"));
    assert.ok(payload.negotiation_plan.includes("Request written breakdown"));
    assert.equal(
      payload.counter_framing,
      "Shift focus from compliance speed to verifiable accuracy.",
    );
    assert.ok(payload.evidence_gaps.includes("Missing itemized cost sheet"));
    assert.ok(payload.evidence_gaps.includes("Unverified contract hash"));
    assert.equal(true, isEqualizerPayload(payload));
  });

  it("rejects prose-only or empty objects", () => {
    assert.equal(isEqualizerPayload("long conversational essay"), false);
    assert.equal(isEqualizerPayload({ threat_decode: "" }), false);
    assert.equal(
      isEqualizerPayload({
        threat_decode: "x",
        negotiation_plan: [],
        counter_framing: "y",
        evidence_gaps: ["z"],
      }),
      false,
    );
  });
});
