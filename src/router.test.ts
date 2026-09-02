import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { routeUtterance } from "./router.js";

describe("router v0", () => {
  it("routes negotiation/deadline context to the Linguistic Equalizer", () => {
    const { routing_decision, router_trace } = routeUtterance(
      "They gave us an artificial deadline and demand we sign the contract today.",
    );
    assert.equal(routing_decision.target_front, "LINGUISTIC_EQUALIZER");
    assert.equal(routing_decision.handoff_token, "EQUALIZER_TACTICAL_V1");
    assert.equal(routing_decision.injected_tone_law, "EMPOWERMENT_FIRST_CHECKLIST");
    assert.equal(routing_decision.trigger_reason, "Direct negotiation context detected");
    assert.ok(router_trace.matched_equalizer_keywords.includes("deadline"));
    assert.equal(router_trace.rule_id, "equalizer_keyword_majority");
  });

  it("routes policy/risk context to the Systemic Analyst", () => {
    const { routing_decision, router_trace } = routeUtterance(
      "Map systemic policy patterns and residual risk for this governance dashboard.",
    );
    assert.equal(routing_decision.target_front, "SYSTEMIC_ANALYST");
    assert.equal(routing_decision.handoff_token, "ANALYST_SYSTEMIC_V1");
    assert.equal(
      routing_decision.trigger_reason,
      "Systemic policy/pattern/risk context detected",
    );
    assert.ok(router_trace.matched_analyst_keywords.includes("policy"));
  });

  it("lets explicit handoff tokens override keywords", () => {
    const equalizer = routeUtterance(
      "ANALYST_SYSTEMIC_V1 please negotiate this deadline with counsel",
    );
    assert.equal(equalizer.routing_decision.target_front, "SYSTEMIC_ANALYST");
    assert.equal(equalizer.router_trace.rule_id, "explicit_handoff_token");

    const analyst = routeUtterance(
      "EQUALIZER_TACTICAL_V1 compute residual risk and policy exposure",
    );
    assert.equal(analyst.routing_decision.target_front, "LINGUISTIC_EQUALIZER");
  });

  it("defaults to the analyst when no Dual-Front signals are present", () => {
    const { routing_decision, router_trace } = routeUtterance(
      "What is the weather in Lisbon?",
    );
    assert.equal(routing_decision.target_front, "SYSTEMIC_ANALYST");
    assert.equal(router_trace.rule_id, "default_analyst");
  });

  it("records VISUAL_HANDOFF_V1 as a side channel, not a third front", () => {
    const phrase =
      "render visual generate image picture perfection no upgrade no fixes create what is described";
    const { routing_decision, router_trace } = routeUtterance(
      `Draft a board. ${phrase}`,
    );
    assert.equal(routing_decision.target_front, "SYSTEMIC_ANALYST");
    assert.equal(router_trace.visual_handoff, "VISUAL_HANDOFF_V1");
  });
});
