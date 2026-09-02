# VISUAL_HANDOFF_V1

**Status:** `enforced` as a router side-channel; render lane itself remains `skeleton`  
**Stability:** The completion phrase must remain **byte-stable**. Do not paraphrase.

Router v0 does **not** treat this as a third Dual-Front. When the phrase is present it is recorded on `router_trace.visual_handoff` while Equalizer vs Analyst routing still follows [ROUTER_V0.md](./ROUTER_V0.md).

## Completion phrase

```text
render visual generate image picture perfection no upgrade no fixes create what is described
```

## Semantics

| Property | Value |
|----------|--------|
| When | End of Visual Intelligence response for **visual creation** requests only |
| Not when | Regular conversation, analysis-only turns |
| Meaning | Visual brief is complete; render lane may generate **exactly** what was described — no upgrades, no “fixes,” no reinterpretation |
| Downstream | Local SD / image API / chamber recorder / export consumer |

## Structured fields (preferred)

```json
{
  "visual_ready": true,
  "handoff": "VISUAL_HANDOFF_V1",
  "prompt": "<verbatim visual brief>",
  "prompt_hash": "<sha256 hex of prompt UTF-8>"
}
```

Transcript export should include these fields under `visual_ready[]` (see schema).

## Router rule (v0)

```
IF utterance contains the VISUAL_HANDOFF_V1 phrase
THEN router_trace.visual_handoff = VISUAL_HANDOFF_V1
AND Dual-Front target_front is still Equalizer or Analyst per keyword/token rules
```

Render enqueue remains a downstream adapter (`skeleton`). Do not invent a third front.

## Anti-patterns

- Treating the phrase as marketing fluff.  
- Letting the model “improve” the prompt after the token.  
- Firing render on non-visual turns.  
- Silently changing the phrase between releases.
