# Architecture — Dual-Front Intelligence System

**Status:** `skeleton`  
**Product:** Spatial XR AI (Command Center)

## Intent

Conversational Dual-Front interface that **automatically selects agents and tools** from utterance context, with shared chat memory across agent switches, Think Mode for deep reasoning, and governed export/wipe.

## Dual fronts

```
┌─────────────────────────────────────────────────────────┐
│                   Command Center UI                     │
│  Chat stream │ Think Mode overlay │ Sidebar tools       │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
     ┌──────────▼──────────┐ ┌────────▼──────────────┐
     │ Linguistic Equalizer│ │ Systemic / Strategic  │
     │ (tactics)           │ │ (policy / OODA)       │
     └──────────┬──────────┘ └────────┬──────────────┘
                │                     │
                └──────────┬──────────┘
                           ▼
                 Agent Router v0 (`skeleton`)
                 keyword + VISUAL_HANDOFF_V1
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   Agent cores      Export schema      Continuity ledger
```

## Five agent cores

| Agent | Responsibility | Primary outputs |
|-------|----------------|-----------------|
| Visual Intelligence | Aesthetic & design analysis | Brief + `VISUAL_HANDOFF_V1` |
| Structural Intelligence | Diagram & hierarchy | Mermaid / topology |
| Linguistic Intelligence | Forensic analysis & citation | Trace, citations |
| Strategic Analyst | OODA loop | Observe→Orient→Decide→Act steps |
| Systemic Analyst | Policy & movement | Policy cards, movement map |

## Linguistic Equalizer tools

| Tool | Intent |
|------|--------|
| Threat Decoder | Contracts / threat language |
| Negotiation Planner | Tactical strategies |
| Document Analyser | Power dynamics extraction |
| Framing Detector | Linguistic framing |

## Quick-action prompts (main panel)

Decode a Threat · Pattern Analysis · Document Forensics · Map Dependencies · Strategic Brief · Cognitive Firewall

## Think Mode

- Toggle activates Neural Reasoning Engine **overlay**.  
- Terminal-style steps + progress bar.  
- Does not block chat unless operator pauses.  
- Status: `skeleton`.

## Mechanical Trace (declared shape)

Multi-pass stack (not query→response alone):

1. Input  
2. Linguistic decomposition  
3. Vulnerability mapping  
4. Strategic intervention  

Aligns with provenance-style records rather than chat dumps.

## Export & wipe

- **Export:** JSON (canonical), TXT, PDF (`skeleton`).  
- **Secure wipe:** clear UI chat; persist only decisions/evidence to continuity ledger.  
- Schema: `docs/schemas/transcript-export.schema.json`.

## Trust UI labels (declared, not enforced)

| Label | Honest meaning today |
|-------|----------------------|
| LOCAL_ONLY | Declared preference until code enforces no cloud memory |
| L5 / Level 5 Equilibrium | UI trust tier until RBAC is real |
| 18ms neural link | Stylistic display until measured p50 latency exists |
| Sovereign Override | Declared RBAC concept |

## Router v0 (planned)

1. Match `VISUAL_HANDOFF_V1` → Visual Intelligence + render lane.  
2. Keyword heuristics for Structural / Linguistic / Strategic / Systemic.  
3. Preserve prior agent context in session memory across switches.  
4. No ML router in Phase 1.

## UI shell

Glassmorphism Command Center (obsidian + cyan + nebula mesh) is **Phase 2+**. This repo ships docs-first; `package.json` reserves npm scripts for a future Vite/React shell.
