// Focused check of the dashboard token verify logic.
// It extracts signToken/verifyToken from api/_token.ts by transpiling the
// single file with esbuild (bundled with vite) into a temp module.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const dir = mkdtempSync(join(tmpdir(), "ptr-token-"));
const out = join(dir, "token.mjs");
execFileSync("npx", ["esbuild", "api/_token.ts", "--format=esm", `--outfile=${out}`], { stdio: "inherit" });
const { signToken, verifyToken } = await import(out);

// Load the local test secret without printing it.
const envText = readFileSync(".env.local", "utf8");
const secret = envText.split("\n").find((l) => l.startsWith("PTR_TOKEN_SECRET=")).slice("PTR_TOKEN_SECRET=".length).trim();
if (!secret) throw new Error("PTR_TOKEN_SECRET missing from .env.local");

const now = Math.floor(Date.now() / 1000);
const email = "member@example.com";
const good = signToken(email, secret, now + 3600);
const ok = verifyToken(good, secret, now);
console.log("valid token accepted:", !!ok && ok.email === email);

// Tampered signature
const parts = good.split(".");
const tampered = `${parts[0]}.${parts[1]}.${parts[2].slice(0, -1)}${parts[2].endsWith("0") ? "1" : "0"}`;
console.log("tampered token rejected:", verifyToken(tampered, secret, now) === null);

// Tampered email payload
const otherEmail = Buffer.from("other@example.com", "utf8").toString("base64url");
console.log("swapped-email token rejected:", verifyToken(`${otherEmail}.${parts[1]}.${parts[2]}`, secret, now) === null);

// Expired
const expired = signToken(email, secret, now - 10);
console.log("expired token rejected:", verifyToken(expired, secret, now) === null);

// Wrong secret
console.log("wrong-secret token rejected:", verifyToken(good, "not-the-secret", now) === null);

// Garbage
console.log("garbage rejected:", verifyToken("nonsense", secret, now) === null && verifyToken("", secret, now) === null);

const all = !!ok && ok.email === email;
if (!all) process.exit(1);
console.log("TOKEN TEST DONE");
