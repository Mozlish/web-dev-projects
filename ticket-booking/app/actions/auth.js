"use server";
// Server Actions for accounts: register, log in, log out.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readDb, updateDb } from "@/lib/db";
import { endSession, hashPassword, startSession, verifyPassword } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // something@something.something
const PHONE_PATTERN = /^01[3-9]\d{8}$/; // a Bangladeshi mobile: 11 digits, 013 to 019

// A form field as trimmed text ("" when it's missing)
function readText(formData, name) {
  return String(formData.get(name) ?? "").trim();
}

// Only follow links to our own pages: "/tickets" yes, "https://other-site.com" no
function safeNextPath(value) {
  const nextPath = String(value ?? "");
  return nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
}

// Used with useActionState: (previous state, form data) -> new state
export async function register(prevState, formData) {
  // values = what the user typed (never the password), sent back to refill the form
  const values = {
    name: readText(formData, "name").replace(/\s+/g, " "), // "  Rafi   Ahmed " -> "Rafi Ahmed"
    email: readText(formData, "email").toLowerCase(),
    phone: readText(formData, "phone").replace(/[\s-]/g, ""), // "01712-345 678" -> "01712345678"
  };
  const password = String(formData.get("password") ?? ""); // never trimmed: spaces can be part of a password
  const nextPath = safeNextPath(formData.get("next"));

  // One message per field, so each one shows under its own input
  const errors = {};
  if (values.name.length < 2) errors.name = "Enter your full name.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (!PHONE_PATTERN.test(values.phone)) errors.phone = "Use an 11-digit mobile number, like 01712345678.";
  if (password.length < 8) errors.password = "Use at least 8 characters.";

  if (Object.keys(errors).length > 0) return { errors, values };

  const passwordHash = await hashPassword(password);

  // Checking and adding in ONE updateDb call: two sign-ups with the same email can't both win
  const user = await updateDb((db) => {
    if (db.users.some((person) => person.email === values.email)) return null;

    const newUser = { id: crypto.randomUUID(), ...values, passwordHash, createdAt: new Date().toISOString() };
    db.users.push(newUser);
    return newUser;
  });

  if (!user) {
    return { errors: { email: "An account with this email already exists. Log in instead." }, values };
  }

  await startSession(user.id);
  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function login(prevState, formData) {
  const email = readText(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  const db = await readDb();
  const user = db.users.find((person) => person.email === email);

  // The same message for "no such email" and "wrong password",
  // so nobody can use this form to find out who has an account
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email and password don't match.", values: { email } };
  }

  await startSession(user.id);
  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function logout() {
  await endSession();
  revalidatePath("/", "layout");
  redirect("/");
}
