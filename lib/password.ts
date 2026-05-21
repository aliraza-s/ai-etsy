import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing using node's built-in scrypt.
 *
 * Zero-dependency, memory-hard, suitable for application-grade auth. Format:
 *   `scrypt$<N>$<r>$<p>$<saltB64>$<hashB64>`
 *
 * Where N/r/p are the scrypt parameters in case we need to rotate them later
 * — verification reads them off the stored hash, so old hashes keep working
 * after we tune cost upward.
 */

const SCRYPT_N = 16384; // CPU/memory cost — 2^14 is a balanced default
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;

const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const derived = await scryptAsync(password.normalize("NFKC"), salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  let derived: Buffer;
  try {
    derived = await scryptAsync(password.normalize("NFKC"), salt, expected.length, { N, r, p });
  } catch {
    return false;
  }
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
