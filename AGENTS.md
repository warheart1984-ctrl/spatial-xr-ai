# Spatial XR AI — Agent Lawbook

**Status:** Router v0 / artifacts / \(R_r\) `enforced`; UI `skeleton`  
Binding norms for agents working in this repository.

## Principles

1. **Declare before you act** — state intent, files, and verification.
2. **Honest status tags** — use `skeleton` / `partial` / `enforced` / `declared`.
3. **No secrets** — never commit `.env`, keys, or credentials.
4. **Stable handoff tokens** — do not paraphrase `EQUALIZER_TACTICAL_V1`, `ANALYST_SYSTEMIC_V1`, or `VISUAL_HANDOFF_V1`.
5. **Continuity over chat dumps** — persist routing decisions, structured artifacts, and \(R_r\) rows — not full transcripts.
6. **Standalone product** — do not import Mandala Rendering Software trees, `runtime/`, `vendor/`, or large binaries.
7. **No model-brand liturgy in active interfaces** — this is a routing/governance layer, not a named local oracle.
8. **Empowerment-first** — Equalizer and Analyst emit checklists, options, questions, and evidence gaps.

## Scope

This repo owns the Dual-Front control plane (`src/`) plus product docs. Hardware security (TPM, DMA/IOMMU, measured boot) belongs in a Phase 2 Trust Substrate repo — see `docs/INTEGRATION_NOTES.md`.

## When changing agent behavior

- Update `docs/ARCHITECTURE.md`, `docs/ROUTER_V0.md`, and relevant schemas.
- Keep the two fronts orthogonal. Do not mix Equalizer tactics and Analyst \(R_r\) in one payload.
- Keep Linguistic Equalizer tools documented alongside Systemic quick-actions.
