# Spatial XR AI — Dual-Front Intelligence System

**Status:** Router v0 / Equalizer artifacts / \(R_r\) contract `enforced`; Command Center UI `skeleton`  
**License:** MIT

Standalone Dual-Front control plane: a **Linguistic Equalizer** (1-on-1 tactics) and a **Systemic Analyst** (policy, patterns, residual risk) never share one bloated chat payload.

```text
Utterance → Router → Dual-Front Handoff → Structured JSON Artifact → Ledger
```

This repo is a routing and governance layer. It does not embed or brand a proprietary model runtime.

## Dual fronts

| Front | Role | Handoff token | Output |
|-------|------|---------------|--------|
| **Linguistic Equalizer** | Threat decode, negotiation, framing, evidence gaps | `EQUALIZER_TACTICAL_V1` | Strict JSON checklist/options/gaps |
| **Systemic Analyst** | Policy/patterns, residual risk \(R_r\) | `ANALYST_SYSTEMIC_V1` | Structured analysis + \(R_r\) contract |

Tone law injected on every handoff: `EMPOWERMENT_FIRST_CHECKLIST` — checklists, options, questions, evidence gaps. The operator stays in command.

## Residual risk

\[
R_r = \text{Inherent Risk} \times (1 - C_e \times E_m)
\]

Inherent Risk is Likelihood × Impact on a hard-coded 5×5. Bands: 1–7 sage / 8–14 slate / 15–20 amber (fail-closed) / 21–25+ deep red (halt).

## Quick start

```bash
npm install
npm test
node dist/cli.js route "They gave us an artificial deadline on this contract."
node dist/cli.js equalize "Refuse the speed tactic and request a written breakdown."
node dist/cli.js risk --likelihood 5 --impact 5 --ce 0.2
node dist/cli.js pipeline "Systemic residual risk: likelihood 4 impact 5 c_e 0.3" --ledger data/ledger.jsonl
```

## Honest status tags

| Lane | Tag |
|------|-----|
| Router v0 (keyword + handoff token) | `enforced` |
| Equalizer JSON schema | `enforced` |
| \(R_r\) formula + 5×5 + bands | `enforced` |
| Tone law injection | `enforced` |
| Append-only JSONL ledger | `enforced` (local file) |
| Glass Command Center UI | `skeleton` |
| Hardware attestation / TPM / measured boot | out of scope (Phase 2 Trust Substrate) |

## Docs

- [Router v0](docs/ROUTER_V0.md)
- [Tone law](docs/TONE_LAW.md)
- [Residual risk contract](docs/RESIDUAL_RISK.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Agent lawbook](AGENTS.md)
- [Visual handoff](docs/VISUAL_HANDOFF_V1.md) (side-channel token, not a third front)

## Related systems (optional)

Continuity Ledger adapters and chamber/episode mapping: [docs/INTEGRATION_NOTES.md](docs/INTEGRATION_NOTES.md). Do not vendor MRS/Infinity trees.

## License

MIT — see [LICENSE](LICENSE).
