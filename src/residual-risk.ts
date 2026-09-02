import { assertNever } from "./assert-never.js";
import type {
  RiskActionCode,
  ResidualRisk,
  RiskBand,
  UiIndicator,
} from "./types.js";

export const RISK_FORMULA =
  "R_r = inherent_risk * (1 - control_effectiveness * evidence_multiplier)" as const;

/** Likelihood × Impact inherent-risk matrix (1–5 each). */
export const INHERENT_RISK_MATRIX: ReadonlyArray<ReadonlyArray<number>> = [
  [1, 2, 3, 4, 5],
  [2, 4, 6, 8, 10],
  [3, 6, 9, 12, 15],
  [4, 8, 12, 16, 20],
  [5, 10, 15, 20, 25],
];

export type Likelihood = 1 | 2 | 3 | 4 | 5;
export type Impact = 1 | 2 | 3 | 4 | 5;

export type ResidualRiskInput = {
  likelihood: Likelihood;
  impact: Impact;
  control_effectiveness: number;
  evidence_multiplier?: number;
};

const BAND_COPY: Record<
  RiskBand,
  {
    severity: string;
    ui_indicator: UiIndicator;
    action_required: string;
    action_code: RiskActionCode;
    fail_closed: boolean;
  }
> = {
  LOW: {
    severity: "Low / Nominal",
    ui_indicator: "SAGE_GREEN",
    action_required: "Standard logging; safe for dispatch.",
    action_code: "STANDARD_LOGGING",
    fail_closed: false,
  },
  MODERATE: {
    severity: "Moderate",
    ui_indicator: "SLATE_BLUE",
    action_required: "Requires manual review or extra evidence gap check.",
    action_code: "MANUAL_REVIEW",
    fail_closed: false,
  },
  HIGH: {
    severity: "High",
    ui_indicator: "AMBER",
    action_required: "Fail-closed gate triggered; escalation required.",
    action_code: "FAIL_CLOSED_ESCALATE",
    fail_closed: true,
  },
  CRITICAL: {
    severity: "Critical",
    ui_indicator: "DEEP_RED",
    action_required: "Immediate halt; trigger containment.",
    action_code: "CONTAINMENT_HALT",
    fail_closed: true,
  },
};

export function isLikelihood(value: number): value is Likelihood {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function isImpact(value: number): value is Impact {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function inherentRisk(likelihood: Likelihood, impact: Impact): number {
  const row = INHERENT_RISK_MATRIX[likelihood - 1];
  const cell = row?.[impact - 1];
  if (cell === undefined) {
    throw new Error(`5×5 matrix miss for L=${likelihood} I=${impact}`);
  }
  return cell;
}

export function bandForResidualRisk(r_r: number): RiskBand {
  if (!Number.isFinite(r_r) || r_r < 0) {
    throw new Error(`R_r must be a finite number ≥ 0, got ${r_r}`);
  }
  if (r_r < 8) {
    return "LOW";
  }
  if (r_r < 15) {
    return "MODERATE";
  }
  if (r_r < 21) {
    return "HIGH";
  }
  return "CRITICAL";
}

export function dashboardRow(band: RiskBand): (typeof BAND_COPY)[RiskBand] {
  switch (band) {
    case "LOW":
    case "MODERATE":
    case "HIGH":
    case "CRITICAL":
      return BAND_COPY[band];
    default:
      return assertNever(band);
  }
}

function clampUnitInterval(name: string, value: number): number {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be in [0, 1], got ${value}`);
  }
  return value;
}

/**
 * Residual risk with evidence-backed control credit.
 * When evidence_multiplier = 1, this is R_r = Inherent Risk × (1 − C_e).
 * Missing evidence (E_m → 0) withholds control credit.
 */
export function computeResidualRisk(input: ResidualRiskInput): ResidualRisk {
  const control_effectiveness = clampUnitInterval(
    "control_effectiveness",
    input.control_effectiveness,
  );
  const evidence_multiplier = clampUnitInterval(
    "evidence_multiplier",
    input.evidence_multiplier ?? 1,
  );
  const inherent_risk = inherentRisk(input.likelihood, input.impact);
  const r_r =
    inherent_risk * (1 - control_effectiveness * evidence_multiplier);
  const band = bandForResidualRisk(r_r);
  const copy = dashboardRow(band);
  return {
    likelihood: input.likelihood,
    impact: input.impact,
    inherent_risk,
    control_effectiveness,
    evidence_multiplier,
    formula: RISK_FORMULA,
    r_r,
    band,
    severity: copy.severity,
    ui_indicator: copy.ui_indicator,
    action_required: copy.action_required,
    action_code: copy.action_code,
    fail_closed: copy.fail_closed,
  };
}

export type ParsedRiskInputs = {
  likelihood: Likelihood | null;
  impact: Impact | null;
  control_effectiveness: number | null;
  evidence_multiplier: number | null;
};

export function parseRiskInputs(utterance: string): ParsedRiskInputs {
  return {
    likelihood: parseScale(utterance, /\blikelihood\b[^0-9]{0,8}([1-5])/i),
    impact: parseImpact(utterance, /\bimpact\b[^0-9]{0,8}([1-5])/i),
    control_effectiveness: parseUnit(
      utterance,
      /\b(?:c_e|ce|control(?:\s+effectiveness)?)\b[^0-9]{0,8}(0(?:\.\d+)?|1(?:\.0+)?)/i,
    ),
    evidence_multiplier: parseUnit(
      utterance,
      /\b(?:e_m|em|evidence(?:\s+multiplier)?)\b[^0-9]{0,8}(0(?:\.\d+)?|1(?:\.0+)?)/i,
    ),
  };
}

function parseScale(utterance: string, pattern: RegExp): Likelihood | null {
  const match = pattern.exec(utterance);
  const raw = match?.[1];
  if (raw === undefined) {
    return null;
  }
  const value = Number.parseInt(raw, 10);
  return isLikelihood(value) ? value : null;
}

function parseImpact(utterance: string, pattern: RegExp): Impact | null {
  const match = pattern.exec(utterance);
  const raw = match?.[1];
  if (raw === undefined) {
    return null;
  }
  const value = Number.parseInt(raw, 10);
  return isImpact(value) ? value : null;
}

function parseUnit(utterance: string, pattern: RegExp): number | null {
  const match = pattern.exec(utterance);
  const raw = match?.[1];
  if (raw === undefined) {
    return null;
  }
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

export function residualRiskFromUtterance(
  utterance: string,
): { risk: ResidualRisk | null; evidence_gaps: string[] } {
  const parsed = parseRiskInputs(utterance);
  const evidence_gaps: string[] = [];
  if (parsed.likelihood === null) {
    evidence_gaps.push("Likelihood (1–5) not provided.");
  }
  if (parsed.impact === null) {
    evidence_gaps.push("Impact (1–5) not provided.");
  }
  if (parsed.control_effectiveness === null) {
    evidence_gaps.push("Control effectiveness C_e in [0, 1] not provided.");
  }
  if (
    parsed.likelihood === null ||
    parsed.impact === null ||
    parsed.control_effectiveness === null
  ) {
    return { risk: null, evidence_gaps };
  }
  return {
    risk: computeResidualRisk({
      likelihood: parsed.likelihood,
      impact: parsed.impact,
      control_effectiveness: parsed.control_effectiveness,
      evidence_multiplier: parsed.evidence_multiplier ?? 1,
    }),
    evidence_gaps,
  };
}

export function riskMatrixDashboard(): {
  formula: typeof RISK_FORMULA;
  matrix: ReadonlyArray<ReadonlyArray<number>>;
  bands: Array<{
    score: string;
    band: RiskBand;
    severity: string;
    ui_indicator: UiIndicator;
    action_required: string;
  }>;
} {
  return {
    formula: RISK_FORMULA,
    matrix: INHERENT_RISK_MATRIX,
    bands: [
      {
        score: "1–7",
        band: "LOW",
        ...dashboardRow("LOW"),
      },
      {
        score: "8–14",
        band: "MODERATE",
        ...dashboardRow("MODERATE"),
      },
      {
        score: "15–20",
        band: "HIGH",
        ...dashboardRow("HIGH"),
      },
      {
        score: "21–25+",
        band: "CRITICAL",
        ...dashboardRow("CRITICAL"),
      },
    ],
  };
}
