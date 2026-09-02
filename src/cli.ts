#!/usr/bin/env node
import { parseArgs } from "node:util";
import { assertNever } from "./assert-never.js";
import { runPipeline } from "./pipeline.js";
import { routeUtterance } from "./router.js";
import { buildEqualizerPayload } from "./equalizer.js";
import {
  computeResidualRisk,
  isLikelihood,
  riskMatrixDashboard,
  type Likelihood,
} from "./residual-risk.js";
import { getToneLaw } from "./tone-law.js";
import { TONE_LAW_ID } from "./types.js";

function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function usage(): string {
  return `spatial-xr — Dual-Front control plane

Usage:
  spatial-xr route <utterance>
  spatial-xr equalize <utterance>
  spatial-xr pipeline <utterance> [--ledger <path>]
  spatial-xr risk --likelihood <1-5> --impact <1-5> --ce <0-1> [--em <0-1>]
  spatial-xr matrix
  spatial-xr tone
`;
}

function requireUtterance(positionals: string[]): string {
  const text = positionals.slice(1).join(" ").trim();
  if (text.length === 0) {
    throw new Error("utterance required");
  }
  return text;
}

function parseScaleFlag(raw: string | undefined, name: string): Likelihood {
  if (raw === undefined) {
    throw new Error(`--${name} required`);
  }
  const value = Number.parseInt(raw, 10);
  if (!isLikelihood(value)) {
    throw new Error(`--${name} must be 1-5`);
  }
  return value;
}

function parseUnitFlag(raw: string | undefined, name: string, required: boolean): number | undefined {
  if (raw === undefined) {
    if (required) {
      throw new Error(`--${name} required`);
    }
    return undefined;
  }
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`--${name} must be in [0, 1]`);
  }
  return value;
}

const COMMANDS = [
  "route",
  "equalize",
  "pipeline",
  "risk",
  "matrix",
  "tone",
] as const;

type Command = (typeof COMMANDS)[number];

function isCommand(value: string): value is Command {
  return (COMMANDS as readonly string[]).includes(value);
}

function main(argv: string[]): number {
  const { values, positionals } = parseArgs({
    args: argv.slice(2),
    allowPositionals: true,
    options: {
      ledger: { type: "string" },
      likelihood: { type: "string" },
      impact: { type: "string" },
      ce: { type: "string" },
      em: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help === true || positionals[0] === undefined) {
    process.stdout.write(usage());
    return values.help === true ? 0 : 1;
  }

  const rawCommand = positionals[0];
  if (!isCommand(rawCommand)) {
    process.stderr.write(`unknown command: ${rawCommand}\n${usage()}`);
    return 1;
  }

  const command: Command = rawCommand;
  switch (command) {
    case "route": {
      const utterance = requireUtterance(positionals);
      const routed = routeUtterance(utterance);
      printJson({ routing_decision: routed.routing_decision });
      return 0;
    }
    case "equalize": {
      const utterance = requireUtterance(positionals);
      printJson({ equalizer_payload: buildEqualizerPayload(utterance) });
      return 0;
    }
    case "pipeline": {
      const utterance = requireUtterance(positionals);
      const result = runPipeline(utterance, { ledgerPath: values.ledger });
      printJson({
        routing_decision: result.routing_decision,
        artifact: result.artifact,
        residual_risk: result.residual_risk,
        ledger_entry_id: result.ledger_entry.entry_id,
      });
      return 0;
    }
    case "risk": {
      const likelihood = parseScaleFlag(values.likelihood, "likelihood");
      const impact = parseScaleFlag(values.impact, "impact");
      const control_effectiveness = parseUnitFlag(values.ce, "ce", true);
      if (control_effectiveness === undefined) {
        throw new Error("--ce required");
      }
      printJson(
        computeResidualRisk({
          likelihood,
          impact,
          control_effectiveness,
          evidence_multiplier: parseUnitFlag(values.em, "em", false),
        }),
      );
      return 0;
    }
    case "matrix": {
      printJson(riskMatrixDashboard());
      return 0;
    }
    case "tone": {
      printJson({
        injected_tone_law: TONE_LAW_ID,
        prompt: getToneLaw(TONE_LAW_ID),
      });
      return 0;
    }
    default:
      return assertNever(command);
  }
}

try {
  process.exitCode = main(process.argv);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 2;
}
