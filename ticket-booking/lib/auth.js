// Real login: hashed passwords and a signed session cookie.
// Everything here uses Node's built-in crypto module, so there's nothing to install.
import "server-only";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDb } from "./db";

const scryptAsync = promisify(scrypt); // scrypt with await instead of a callback

const SESSION_COOKIE = "railgo-session";
const SESSION_DAYS = 7;

// ----- 1. Passwords -----

// "railgo123" -> "3f9c...e1:8a2b...77" (salt:hash). The password itself is never stored.
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex"); // random, different for every user
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

// Hash the typed password with the SAME salt, then compare the two hashes
export async function verifyPassword(password, storedHash) {
  const [salt, hashHex] = storedHash.split(":");
  const hash = await scryptAsync(password, salt, 64);
  return timingSafeEqual(hash, Buffer.from(hashHex, "hex"));
}

// ----- 2. The session cookie -----

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short. Add it to .env.local (Step 4), then restart npm run dev.");
  }
  return secret;
}

// A signature only someone who knows the secret can make
function sign(text) {
  return createHmac("sha256", getSecret()).update(text).digest("base64url");
}

// "userId.expiresAt.signature". Change one character and the signature no longer matches.
function createSessionValue(userId) {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

// The user id, or null if the cookie was edited, forged or has expired
function readSessionValue(value) {
  const parts = value?.split(".") ?? [];
  if (parts.length !== 3) return null;

  const [userId, expiresAt, signature] = parts;
  const expected = sign(`${userId}.${expiresAt}`);
  const isValid =
    signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!isValid || Number(expiresAt) < Date.now()) return null;
  return userId;
}

// Only call these two from a Server Action: pages can read cookies but not set them
export async function startSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionValue(userId), {
    httpOnly: true, // page JavaScript can't read it
    sameSite: "lax", // other sites can't send it with their own form posts
    secure: process.env.NODE_ENV === "production", // HTTPS only, once deployed
    maxAge: SESSION_DAYS * 24 * 60 * 60, // in seconds
    path: "/",
  });
}

export async function endSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ----- 3. Who is logged in? -----

// cache() = run once per request. The Header and the page both ask,
// but the cookie is checked and db.json is read only once.
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const userId = readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!userId) return null;

  const db = await readDb();
  const user = db.users.find((person) => person.id === userId);
  if (!user) return null;

  // Pick the safe fields: the password hash never leaves this file
  return { id: user.id, name: user.name, email: user.email, phone: user.phone };
});

// For pages you must log in to see: no user -> /login, then come back
export async function requireUser(backTo) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(backTo)}`);
  return user;
}
