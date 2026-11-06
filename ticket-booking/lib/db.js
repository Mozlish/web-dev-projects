// Our tiny "database": one JSON file on disk, holding users and bookings.
// It holds password hashes, so "server-only" makes sure no Client Component ever imports it.
import "server-only";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createSeedData } from "@/data/seed";

// On Vercel the project folder is read-only; only the temp folder can be written.
// (Temporary storage: it can reset when the serverless instance restarts.)
const DB_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), "ticket-db.json")
  : path.join(process.cwd(), "data", "db.json");
const TEMP_FILE = `${DB_FILE}.tmp`;

export async function readDb() {
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

// Write a temporary file, then swap it in. A rename is instant,
// so nobody ever reads a half-written db.json.
async function writeDb(db) {
  await writeFile(TEMP_FILE, JSON.stringify(db, null, 2));
  await rename(TEMP_FILE, DB_FILE);
}

// Every change goes through here, ONE AT A TIME.
// Two people pressing "Confirm" in the same second both read the file, both see seat
// KA-12 free, and both save. Waiting in line means the second one reads the file only
// after the first one has saved, and sees the seat is gone.
let queue = Promise.resolve();

export function updateDb(change) {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await change(db); // change() edits db and returns anything it likes
    await writeDb(db);
    return result;
  });
  queue = run.catch(() => {}); // a failed change must not block the ones after it
  return run;
}
