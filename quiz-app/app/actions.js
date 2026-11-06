"use server";
// Every function in this file is a Server Action: it always runs on the server,
// even when a form or a button in the browser calls it.

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readDb, writeDb } from "@/lib/db";
import { getCurrentParticipant, PARTICIPANT_COOKIE } from "@/lib/participant";
import { gradeAnswers } from "@/lib/quiz";

const ONE_YEAR = 60 * 60 * 24 * 365; // in seconds

// Only follow links to our own pages: "/quiz/x" yes, "https://other-site.com" no
function safeNextPath(value) {
  const nextPath = String(value ?? "");
  return nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
}

// Used with useActionState: gets the previous state first, then the form data
export async function joinQuiz(prevState, formData) {
  // "  maya   chen " -> "maya chen"
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const nextPath = safeNextPath(formData.get("next"));

  if (name.length < 2) return { error: "Your name needs at least 2 characters.", name };
  if (name.length > 30) return { error: "Keep your name to 30 characters or fewer.", name };

  const db = await readDb();

  // The same name (ignoring capitals) is the same participant, so you can come back later
  let participant = db.participants.find((person) => person.name.toLowerCase() === name.toLowerCase());

  if (!participant) {
    participant = { id: crypto.randomUUID(), name };
    db.participants.push(participant);
    await writeDb(db);
  }

  // The browser keeps this cookie and sends it with every request
  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, participant.id, {
    httpOnly: true, // page JavaScript can't read it
    sameSite: "lax",
    maxAge: ONE_YEAR,
  });

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function leaveQuiz() {
  const cookieStore = await cookies();
  cookieStore.delete(PARTICIPANT_COOKIE);

  revalidatePath("/", "layout");
  redirect("/join");
}

// Called by the quiz player: answers = { q1: "b", q2: "c" }
export async function submitQuiz(quizId, answers, secondsUsed) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect(`/join?next=/quiz/${quizId}`);

  const db = await readDb();
  const quiz = db.quizzes.find((item) => item.id === quizId);
  if (!quiz) redirect("/");

  // Grading happens HERE, on the server, with the answer key the browser never saw
  const result = gradeAnswers(quiz, answers);

  // Never trust numbers from the browser: keep the time between 0 and the limit
  const timeTaken = Math.min(Math.max(Math.round(Number(secondsUsed)) || 0, 0), quiz.timeLimit);

  const attempt = {
    id: crypto.randomUUID(),
    quizId: quiz.id,
    participantId: participant.id,
    ...result, // score, total, answers
    timeTaken,
    createdAt: new Date().toISOString(),
  };

  db.attempts.push(attempt);
  await writeDb(db);

  revalidatePath("/", "layout");
  redirect(`/result/${attempt.id}`);
}
