import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const FORBIDDEN = [
  /GPT-5/i,
  /Neural Core/i,
  /Professor Claude/i,
  /\bThor\b/,
  /LOCAL_ONLY/,
  /\bL5\b/,
  /18ms/,
];

function walkTs(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTs(path));
      continue;
    }
    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      out.push(path);
    }
  }
  return out;
}

describe("active code interfaces", () => {
  it("do not carry model-brand or L5/LOCAL_ONLY liturgy", () => {
    const files = walkTs(SRC_DIR);
    assert.ok(files.length > 0);
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN) {
        if (pattern.test(text)) {
          hits.push(`${file} matches ${pattern}`);
        }
      }
    }
    assert.deepEqual(hits, []);
  });
});
