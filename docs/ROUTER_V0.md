# Router v0 — Dual-Front deterministic handoff

**Status:** `enforced` (rule-based; no ML router)

Core loop:

```text
Utterance → Router → Dual-Front Handoff → Structured JSON Artifact → Ledger
```

The router assigns **one** front. It does not mix 1-on-1 negotiation tools with systemic risk models in a single payload.

## Routing decision (exact shape)

```json
{
  "routing_decision": {
    "target_front": "LINGUISTIC_EQUALIZER",
    "handoff_token": "EQUALIZER_TACTICAL_V1",
    "trigger_reason": "Direct negotiation context detected",
    "injected_tone_law": "EMPOWERMENT_FIRST_CHECKLIST"
  }
}
```

| Field | Values |
|-------|--------|
| `target_front` | `LINGUISTIC_EQUALIZER` \| `SYSTEMIC_ANALYST` |
| `handoff_token` | `EQUALIZER_TACTICAL_V1` \| `ANALYST_SYSTEMIC_V1` |
| `injected_tone_law` | `EMPOWERMENT_FIRST_CHECKLIST` |

## Rule order

1. **Explicit token** in the utterance (`EQUALIZER_TACTICAL_V1` or `ANALYST_SYSTEMIC_V1`) wins.
2. Else **keyword majority** (Equalizer: negotiation/deadline/threat/contract; Analyst: policy/pattern/risk/R_r/OODA).
3. Tie with tactical hits → Equalizer.
4. No Dual-Front signals → Analyst (`default_analyst`).

`VISUAL_HANDOFF_V1` is recorded on `router_trace.visual_handoff` only. It is **not** a third front.

Schema: [schemas/routing-decision.schema.json](./schemas/routing-decision.schema.json)
