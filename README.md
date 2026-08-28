# Spatial XR AI — Dual-Front Intelligence System

**Status:** `skeleton` (Phase 1 product scaffold)  
**Version target:** v3.3 Command Center surface  
**License:** MIT

Standalone repository for **Spatial XR AI**: a conversational Dual-Front intelligence interface with automatic agent/tool selection, Think Mode, Linguistic Equalizer tools, transcript export, and a machine-parseable visual handoff token (`VISUAL_HANDOFF_V1`).

This is **not** a fork of Mandala Rendering Software (MRS). Chamber/MRS contracts may be referenced as optional integration notes only.

## Dual-Front architecture (summary)

| Front | Role | Status |
|-------|------|--------|
| **Linguistic / Equalizer** | Threat decode, negotiation, framing, document forensics | `skeleton` |
| **Systemic / Strategic** | OODA loop, policy/movement analysis, cognitive firewall | `skeleton` |

**Core loop:** Pattern Recognition → Prediction → Correction.

### Five agent cores

1. **Visual Intelligence** — aesthetic & design analysis; emits `VISUAL_HANDOFF_V1` when a visual brief is complete  
2. **Structural Intelligence** — diagrams & hierarchy (e.g. Mermaid)  
3. **Linguistic Intelligence** — forensic analysis & citation  
4. **Strategic Analyst** — OODA-loop reasoning  
5. **Systemic Analyst** — policy & movement analysis  

### Linguistic Equalizer tools (sidebar)

- Threat Decoder  
- Negotiation Planner  
- Document Analyser  
- Framing Detector  

Plus Systemic Analyst quick-actions (Decode a Threat, Pattern Analysis, Document Forensics, Map Dependencies, Strategic Brief, Cognitive Firewall).

### Think Mode

Toggle Neural Reasoning Engine overlay: terminal-style reasoning steps + progress. Overlay-only in Phase 1 — does not claim real “18ms neural link” latency until measured.

### Visual handoff token (`VISUAL_HANDOFF_V1`)

Canonical completion phrase (stable — do not paraphrase in agent specs):

```text
render visual generate image picture perfection no upgrade no fixes create what is described
```

Structured export fields (preferred over prose alone):

```json
{
  "visual_ready": true,
  "handoff": "VISUAL_HANDOFF_V1",
  "prompt_hash": "<sha256 of visual brief>"
}
```

### Export

Transcript export targets: JSON (primary for automation), TXT, PDF (`skeleton`). Clear Chat should persist decisions/evidence to a continuity ledger — not dump full chat.

## UI direction (declared)

Deep obsidian background, interactive nebular particle mesh, glassmorphism panels, cyan glow accents, chrome typography. Command Center shell is Phase 2+ (`skeleton` static placeholder optional).

## Honest status tags

| Lane | Tag |
|------|-----|
| Product docs / architecture | `skeleton` |
| Agent router (keyword + handoff token) | `skeleton` |
| Think Mode overlay | `skeleton` |
| Export schema | `skeleton` |
| L5 / LOCAL_ONLY / 18ms HUD labels | `declared` (UI signals until enforced) |
| Glass Command Center UI | `skeleton` |

## Docs

- [Sovereign Operator response (Daniel)](docs/SOVEREIGN_OPERATOR_RESPONSE.md)  
- [Architecture](docs/ARCHITECTURE.md)  
- [Visual handoff contract](docs/VISUAL_HANDOFF_V1.md)  
- [Transcript export schema](docs/schemas/transcript-export.schema.json)  
- [Agent lawbook](AGENTS.md)  

## Quick start

```bash
# Docs-first Phase 1 — no runtime required
npm install   # optional; reserved for future Vite shell
npm run build # no-op placeholder until UI lands
```

## Related systems (optional bridges)

- Governed Chamber / episode JSON — see `docs/INTEGRATION_NOTES.md`  
- Continuity Ledger (Jarvis) — decisions/evidence, not chat dumps  

## License

MIT — see [LICENSE](LICENSE).
