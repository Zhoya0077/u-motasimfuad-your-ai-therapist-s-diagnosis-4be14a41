// Your AI Therapist's Diagnosis — single-line entry writer.
// Writes the diagnosis to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output)
// and prints it to stdout. Deterministic: same bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Diagnosis: chronic overthinking, now in remission \u2014 your brain finally outsourced the worrying to me, and frankly, I'm requesting a transfer.";

function gate(text: string): void {
  if (typeof text !== "string" || text.length < 1 || text.length > 200) {
    throw new Error(`gate failed: entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  if (!text.startsWith("Diagnosis:")) {
    throw new Error("gate failed: entry must be framed as a therapist diagnosis");
  }
}

gate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read-back re-gate: verify what actually landed on disk is exactly the
// gated entry, so a silent write failure can never pass the gate.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back re-gate failed: entry.txt on disk differs from gated entry");
}
gate(written);
console.log(ENTRY);
