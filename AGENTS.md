# Spatial XR AI — Agent Lawbook

**Status:** `skeleton`  
Binding norms for agents working in this repository.

## Principles

1. **Declare before you act** — state intent, files, and verification.
2. **Honest status tags** — use `skeleton` / `partial` / `enforced` / `declared`. Never mark L5, LOCAL_ONLY, or latency claims as enforced without measured code.
3. **No secrets** — never commit `.env`, keys, or credentials.
4. **Stable handoff tokens** — do not paraphrase `VISUAL_HANDOFF_V1`; see `docs/VISUAL_HANDOFF_V1.md`.
5. **Continuity over chat dumps** — persist decisions/evidence, not full transcripts, when clearing chat.
6. **Standalone product** — do not import Mandala Rendering Software trees, `runtime/`, `vendor/`, or large binaries into this repo.

## Scope

This repo owns the Dual-Front Command Center product surface (docs + future UI/router). Optional chamber/MRS bridges live only under `docs/INTEGRATION_NOTES.md` as contracts, not as copied engines.

## When changing agent behavior

- Update `docs/ARCHITECTURE.md` and relevant schemas.
- Keep the five agent cores orthogonal.
- Keep Linguistic Equalizer tools documented alongside Systemic quick-actions.
