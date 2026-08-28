# VISUAL_HANDOFF_V1

**Status:** `skeleton` (contract declared; router not enforced)  
**Owner:** Visual Intelligence agent  
**Stability:** The completion phrase must remain **byte-stable**. Do not paraphrase in prompts or UI copy that the router matches.

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
IF response contains VISUAL_HANDOFF_V1 phrase
AND turn intent == visual_creation
THEN select agent = Visual Intelligence
AND enqueue render job with prompt = last visual brief
```

## Anti-patterns

- Treating the phrase as marketing fluff.  
- Letting the model “improve” the prompt after the token.  
- Firing render on non-visual turns.  
- Silently changing the phrase between releases.
