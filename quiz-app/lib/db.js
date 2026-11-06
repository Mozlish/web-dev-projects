// Our tiny "database": one JSON file on disk.
// It holds the answer key, so it must never reach the browser.
// "server-only" turns an accidental import from a Client Component into a build error.
import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Redis } from "@upstash/redis";
import { createSeedData } from "@/data/seed";

// On Vercel the data lives in Upstash Redis (shared by every server instance).
const redis = process.env.KV_REST_API_URL
  ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  : null;
const REDIS_KEY = "quiz-db";

// On Vercel the project folder is read-only; only the temp folder can be written.
// (Temporary storage: it can reset when the serverless instance restarts.)
const DB_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), "quiz-db.json")
  : path.join(process.cwd(), "data", "db.json");

export async function readDb() {
  if (redis) {
    const stored = await redis.get(REDIS_KEY);
    if (stored) return stored;
    const db = createSeedData();
    await redis.set(REDIS_KEY, db);
    return db;
  }
  try {
    const text = await readFile(DB_FILE, "utf8");
    return JSON.parse(text);
  } catch (error) {
    // ENOENT = "file not found": first run, so create it from the seed
    if (error.code !== "ENOENT") throw error;
    const db = createSeedData();
    await writeDb(db);
    return db;
  }
}

export async function writeDb(db) {
  if (redis) return void (await redis.set(REDIS_KEY, db));
  await writeFile(DB_FILE, JSON.stringify(db, null, 2));
}
