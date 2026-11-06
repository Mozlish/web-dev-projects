// Who is playing? There are no passwords: a cookie remembers the participant's id.
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDb } from "./db";

export const PARTICIPANT_COOKIE = "quiz-participant";

// The participant from the cookie, or null when nobody has joined yet
export async function getCurrentParticipant() {
  const cookieStore = await cookies();
  const participantId = cookieStore.get(PARTICIPANT_COOKIE)?.value;
  if (!participantId) return null;

  const db = await readDb();
  return db.participants.find((person) => person.id === participantId) ?? null;
}

// For pages you must join first: no participant -> go to /join, then come back
export async function requireParticipant(backTo) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect(`/join?next=${encodeURIComponent(backTo)}`);
  return participant;
}
