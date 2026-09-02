import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INHERENT_RISK_MATRIX,
  bandForResidualRisk,
  computeResidualRisk,
  inherentRisk,
  residualRiskFromUtterance,
} from "./residual-risk.js";
import type { Likelihood } from "./residual-risk.js";

const SCALE: Likelihood[] = [1, 2, 3, 4, 5];

describe("residual risk contract", () => {
  it("hard-codes a 5×5 likelihood × impact matrix equal to L*I", () => {
    for (const likelihood of SCALE) {
      for (const impact of SCALE) {
        assert.equal(inherentRisk(likelihood, impact), likelihood * impact);
        assert.equal(
          INHERENT_RISK_MATRIX[likelihood - 1]?.[impact - 1],
          likelihood * impact,
        );
      }
    }
  });

  it("uses R_r = inherent_risk * (1 - C_e) when evidence_multiplier defaults to 1", () => {
    const risk = computeResidualRisk({
      likelihood: 4,
      impact: 5,
      control_effectiveness: 0.25,
    });
    assert.equal(risk.inherent_risk, 20);
    assert.equal(risk.evidence_multiplier, 1);
    assert.equal(risk.r_r, 15);
    assert.equal(risk.band, "HIGH");
    assert.equal(risk.ui_indicator, "AMBER");
    assert.equal(true, risk.fail_closed);
    assert.equal(risk.action_code, "FAIL_CLOSED_ESCALATE");
  });

  it("withholds control credit when the evidence multiplier is 0", () => {
    const risk = computeResidualRisk({
      likelihood: 5,
      impact: 5,
      control_effectiveness: 1,
      evidence_multiplier: 0,
    });
    assert.equal(risk.r_r, 25);
    assert.equal(risk.band, "CRITICAL");
    assert.equal(risk.ui_indicator, "DEEP_RED");
    assert.equal(risk.action_code, "CONTAINMENT_HALT");
  });

  it("maps bands to the board-ready dashboard table", () => {
    assert.equal(bandForResidualRisk(0), "LOW");
    assert.equal(bandForResidualRisk(7.9), "LOW");
    assert.equal(bandForResidualRisk(8), "MODERATE");
    assert.equal(bandForResidualRisk(14.9), "MODERATE");
    assert.equal(bandForResidualRisk(15), "HIGH");
    assert.equal(bandForResidualRisk(20.9), "HIGH");
    assert.equal(bandForResidualRisk(21), "CRITICAL");
    assert.equal(bandForResidualRisk(25), "CRITICAL");
    assert.equal(bandForResidualRisk(30), "CRITICAL");
  });

  it("refuses to invent R_r when utterance inputs are missing", () => {
    const { risk, evidence_gaps } = residualRiskFromUtterance(
      "Need a residual risk dashboard for this policy.",
    );
    assert.equal(risk, null);
    assert.ok(evidence_gaps.some((gap) => gap.includes("Likelihood")));
    assert.ok(evidence_gaps.some((gap) => gap.includes("Impact")));
    assert.ok(evidence_gaps.some((gap) => gap.includes("C_e")));
  });

  it("parses likelihood, impact, and C_e from an utterance", () => {
    const { risk, evidence_gaps } = residualRiskFromUtterance(
      "likelihood 3 impact 3 control effectiveness 0.5 evidence multiplier 1",
    );
    assert.equal(evidence_gaps.length, 0);
    assert.equal(risk?.inherent_risk, 9);
    assert.equal(risk?.r_r, 4.5);
    assert.equal(risk?.band, "LOW");
    assert.equal(risk?.ui_indicator, "SAGE_GREEN");
  });
});
