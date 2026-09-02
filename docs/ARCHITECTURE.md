# Architecture — Dual-Front Intelligence System

**Status:** control plane `enforced`; Command Center UI `skeleton`  
**Product:** Spatial XR AI

## Intent

Separate **1-on-1 tactical language** from **systemic policy/risk** so they never share a single chat stream. Every turn is a deterministic loop:

```text
Utterance → Router → Dual-Front Handoff → Structured JSON Artifact → Ledger
```

## Control plane

```
                    Utterance
                         │
                         ▼
                 Router v0 (enforced)
              keyword + handoff tokens
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
 Linguistic Equalizer          Systemic Analyst
 EQUALIZER_TACTICAL_V1         ANALYST_SYSTEMIC_V1
 Tone: EMPOWERMENT_FIRST       Tone: EMPOWERMENT_FIRST
           │                           │
           ▼                           ▼
 equalizer_payload JSON         analyst_payload JSON
 (decode/plan/frame/gaps)       (patterns/options/R_r)
           │                           │
           └─────────────┬─────────────┘
                         ▼
                 Ledger JSONL row
```

## Dual fronts (load-bearing)

| Front | Responsibility | Primary outputs |
|-------|----------------|-----------------|
| Linguistic Equalizer | Threat decode, negotiation, counter-framing | `equalizer_payload` |
| Systemic Analyst | Policy, patterns, residual risk | `analyst_payload` + \(R_r\) |

Visual Intelligence completion still uses `VISUAL_HANDOFF_V1` as a **side-channel** on `router_trace`. It is not a third front and does not mix into Equalizer/Analyst payloads.

## Residual risk

Hard formula in `src/residual-risk.ts`. See [RESIDUAL_RISK.md](./RESIDUAL_RISK.md).

## Think Mode

Optional overlay for operator-visible steps. Overlay-only. Not a branded neural engine.

## Export & wipe

- **Ledger:** append-only JSONL (`spatial-xr-ledger-v0`) of routing + artifact + \(R_r\).
- **Transcript export:** still available as `docs/schemas/transcript-export.schema.json` for adapters.
- **Wipe:** clear UI chat when it exists; keep ledger rows.

## Out of scope here

- Hardware attestation (TPM, IOMMU, measured boot, SMM) — Phase 2 Trust Substrate.
- Model brand names in UI or router.
- Metaphysical style cards presented as reasoning engines.

## UI shell

Glass Command Center (obsidian + cyan) is **Phase 2+**. Runtime today is the CLI + library in `src/`.
