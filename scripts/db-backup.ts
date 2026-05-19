/**
 * Postgres backup helper.
 *
 * Snapshots the running `craftly-postgres` container to a timestamped
 * `pg_dump` archive in `./backups/`. Designed for local dev — for production
 * use a managed backup (RDS automated, Supabase point-in-time, etc).
 *
 * Run: `pnpm db:backup`
 */
import "dotenv/config";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const execFileP = promisify(execFile);

const CONTAINER = process.env.DB_BACKUP_CONTAINER ?? "craftly-postgres";
const USER = process.env.POSTGRES_USER ?? "craftly";
const DB = process.env.POSTGRES_DB ?? "craftly";

async function ensureDir(dir: string) {
  try {
    const s = await stat(dir);
    if (!s.isDirectory()) throw new Error(`${dir} exists but is not a directory`);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(
    d.getMinutes(),
  )}${pad(d.getSeconds())}`;
}

async function main() {
  const outDir = path.resolve(process.cwd(), "backups");
  await ensureDir(outDir);
  const outFile = path.join(outDir, `craftly-${timestamp()}.sql`);

  console.log(`→ Snapshotting ${DB} from container ${CONTAINER}`);
  console.log(`  → ${outFile}`);

  // Use docker exec + pg_dump custom format → portable, restorable with pg_restore.
  const { stdout, stderr } = await execFileP("docker", [
    "exec",
    "-t",
    CONTAINER,
    "pg_dump",
    "-U",
    USER,
    "-d",
    DB,
    "-F",
    "c", // custom format (compressed, restorable)
  ]);

  if (stderr) {
    // pg_dump writes status to stderr — only treat as fatal if stdout is empty.
    if (!stdout || stdout.length === 0) {
      throw new Error(`pg_dump failed: ${stderr}`);
    }
  }

  const fs = await import("node:fs/promises");
  await fs.writeFile(outFile, stdout, "binary");

  const stats = await fs.stat(outFile);
  console.log(`✓ Wrote ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`\nRestore with:`);
  console.log(
    `  docker exec -i ${CONTAINER} pg_restore -U ${USER} -d ${DB} --clean --if-exists < ${outFile}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
