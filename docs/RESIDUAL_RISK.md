# Residual Risk (\(R_r\)) contract

**Status:** `enforced` (formula + 5×5 matrix + band table in `src/residual-risk.ts`)

## Formula

\[
R_r = \text{Inherent Risk} \times (1 - C_e \times E_m)
\]

- Inherent Risk = Likelihood × Impact, Likelihood and Impact ∈ {1,2,3,4,5} (hard-coded 5×5).
- \(C_e \in [0,1]\) — control effectiveness.
- \(E_m \in [0,1]\) — evidence multiplier. Default **1** so the formula reduces to \(R_r = \text{Inherent Risk} \times (1 - C_e)\). Missing evidence (\(E_m \rightarrow 0\)) withholds control credit.

\(R_r\) is never inferred from “vibes.” If L, I, or \(C_e\) are missing, the Analyst artifact lists evidence gaps and `residual_risk` is `null`.

## Board-ready bands

| Score | Band | UI | Action |
|-------|------|----|--------|
| 1–7 (and 0 from perfect controls) | LOW | Sage Green | Standard logging; safe for dispatch |
| 8–14 | MODERATE | Slate Blue | Manual review or extra evidence-gap check |
| 15–20 | HIGH | Amber | Fail-closed gate; escalation required |
| 21–25+ | CRITICAL | Deep Red | Immediate halt; containment |

High and Critical set `fail_closed: true`. Containment is an `action_code` (`CONTAINMENT_HALT`), not a hardware or robot runtime in this repo.

Print the matrix: `node dist/cli.js matrix`.

Schema: [schemas/residual-risk.schema.json](./schemas/residual-risk.schema.json)
