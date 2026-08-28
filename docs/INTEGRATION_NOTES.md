# Integration notes (optional bridges)

**Status:** `skeleton`  
This product is standalone. The notes below are **contracts only** — do not copy MRS/Infinity trees into this repo.

## Continuity ledger

When chat is cleared, persist durable outcomes as decisions/evidence (not full transcripts):

- Example endpoint: `POST /api/jarvis/memory` on a local Continuity Ledger (`JARVIS_MEMORYBOARD_URL`).  
- Prefer `type=decision` with evidence links.

## Episode / chamber sample (description only)

If bridging to a governed kinetic substrate, transcript beats may map to episode JSON of the form:

```json
{
  "episode_id": "ep_00x",
  "beats": [
    {
      "beat_id": "b001",
      "agent": "strategic_analyst",
      "intent": "ooda_orient",
      "say_prompt": "…",
      "visual_ready": false
    }
  ],
  "provenance": {
    "session_id": "…",
    "exported_at": "…"
  }
}
```

Canonical export for Spatial XR remains `docs/schemas/transcript-export.schema.json`. Episode mapping is an adapter concern outside Phase 1.

## What not to vendor

- `runtime/`, `node_modules/`, `vendor/`  
- Jarvis data dumps  
- Large binaries / frame sequences  
- `.env` secrets  
- Full Mandala Rendering Software or Project Infinity trees
