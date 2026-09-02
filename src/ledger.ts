import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { LEDGER_SCHEMA_VERSION, type LedgerEntry } from "./types.js";

export function utteranceHash(utterance: string): string {
  return createHash("sha256").update(utterance, "utf8").digest("hex");
}

export function appendLedger(
  filePath: string,
  entry: LedgerEntry,
): void {
  mkdirSync(dirname(filePath), { recursive: true });
  appendFileSync(filePath, `${JSON.stringify(entry)}\n`, "utf8");
}

export function makeLedgerEntry(
  partial: Omit<LedgerEntry, "schema_version">,
): LedgerEntry {
  return {
    schema_version: LEDGER_SCHEMA_VERSION,
    ...partial,
  };
}
