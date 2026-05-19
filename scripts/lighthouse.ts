/**
 * Lighthouse audit runner.
 *
 * Runs lighthouse against a curated list of public URLs and prints a
 * compact summary table. Requires the dev or prod server to be running
 * (default: http://localhost:3000). Uses `npx lighthouse` so we don't
 * have to install the heavy `lighthouse` package as a project dep.
 *
 * Run: `pnpm lh` (with the server running in another terminal)
 *
 * Quality gates we target:
 *   Performance  ≥ 90
 *   Accessibility ≥ 95
 *   Best practices ≥ 95
 *   SEO ≥ 95
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const execFileP = promisify(execFile);

const BASE = process.env.LH_BASE_URL ?? "http://localhost:3000";
const PRESET = process.env.LH_PRESET ?? "desktop"; // "desktop" or "mobile"

const URLS = [
  "/",
  "/pricing",
  "/tools",
  "/tools/tag-generator",
  "/tools/fee-calculator",
  "/about",
  "/contact",
  "/privacy",
];

interface CategoryScores {
  performance: number;
  accessibility: number;
  "best-practices": number;
  seo: number;
}

interface LhJson {
  finalUrl: string;
  categories: Record<keyof CategoryScores, { score: number }>;
}

async function runOne(url: string): Promise<CategoryScores & { url: string }> {
  const full = `${BASE}${url}`;
  console.log(`  → ${url}`);
  const { stdout } = await execFileP(
    "npx",
    [
      "-y",
      "lighthouse",
      full,
      `--preset=${PRESET === "desktop" ? "desktop" : "perf"}`,
      "--quiet",
      "--chrome-flags=--headless=new --no-sandbox",
      "--output=json",
      "--output-path=stdout",
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  const json = JSON.parse(stdout) as LhJson;
  return {
    url,
    performance: Math.round(json.categories.performance.score * 100),
    accessibility: Math.round(json.categories.accessibility.score * 100),
    "best-practices": Math.round(json.categories["best-practices"].score * 100),
    seo: Math.round(json.categories.seo.score * 100),
  };
}

function pad(s: string | number, n: number, align: "left" | "right" = "right"): string {
  const str = String(s);
  if (str.length >= n) return str;
  return align === "left" ? str.padEnd(n, " ") : str.padStart(n, " ");
}

function colorScore(score: number): string {
  if (score >= 90) return `\x1b[32m${pad(score, 3)}\x1b[0m`;
  if (score >= 50) return `\x1b[33m${pad(score, 3)}\x1b[0m`;
  return `\x1b[31m${pad(score, 3)}\x1b[0m`;
}

async function main() {
  console.log(`Lighthouse audit · base=${BASE} preset=${PRESET}\n`);
  const results: Awaited<ReturnType<typeof runOne>>[] = [];
  for (const url of URLS) {
    try {
      results.push(await runOne(url));
    } catch (err) {
      console.error(`  ✗ ${url} — ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log("\n" + pad("URL", 32, "left") + " | Perf | A11y | BP  | SEO");
  console.log("-".repeat(32) + " | ---- | ---- | --- | ---");
  for (const r of results) {
    console.log(
      `${pad(r.url, 32, "left")} | ${colorScore(r.performance)} | ${colorScore(r.accessibility)} | ${colorScore(r["best-practices"])} | ${colorScore(r.seo)}`,
    );
  }

  const outDir = path.resolve(process.cwd(), ".lighthouse");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await writeFile(outFile, JSON.stringify(results, null, 2));
  console.log(`\nFull report: ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
