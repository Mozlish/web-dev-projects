// Read helpers for pages. Each one returns only what its page needs.
import "server-only";
import { connection } from "next/server";
import { readDb } from "./db";
import { buildLeaderboard } from "./quiz";

// connection() = "render on every request", so pages never show a stale copy of db.json
async function getDb() {
  await connection();
  return readDb();
}

function attemptsFor(db, quizId) {
  return db.attempts.filter((attempt) => attempt.quizId === quizId);
}

// Home page: one card per quiz. Counts only, no questions.
export async function getQuizCards(participantId) {
  const db = await getDb();

  return db.quizzes.map((quiz) => {
    const leaderboard = buildLeaderboard(attemptsFor(db, quiz.id), db.participants);
    const myRow = leaderboard.find((row) => row.attempt.participantId === participantId);

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      topic: quiz.topic,
      level: quiz.level,
      color: quiz.color,
      timeLimit: quiz.timeLimit,
      questionCount: quiz.questions.length,
      playerCount: leaderboard.length,
      myBest: myRow ? myRow.attempt : null,
    };
  });
}

// Leaderboard tabs: just the names
export async function getQuizList() {
  const db = await getDb();
  return db.quizzes.map((quiz) => ({ id: quiz.id, title: quiz.title }));
}

// The quiz page. This object is sent to a Client Component, so anything in it
// can be read in the browser. We PICK the safe fields: answer and explanation stay here.
export async function getQuizForPlayer(quizId) {
  const db = await getDb();
  const quiz = db.quizzes.find((item) => item.id === quizId);
  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    topic: quiz.topic,
    level: quiz.level,
    color: quiz.color,
    timeLimit: quiz.timeLimit,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      options: question.options,
    })),
  };
}

// The result page: after submitting, the answers and explanations may be shown
export async function getResult(attemptId) {
  const db = await getDb();
  const attempt = db.attempts.find((item) => item.id === attemptId);
  if (!attempt) return null;

  const quiz = db.quizzes.find((item) => item.id === attempt.quizId);
  const participant = db.participants.find((person) => person.id === attempt.participantId);
  const leaderboard = buildLeaderboard(attemptsFor(db, quiz.id), db.participants);
  const myRow = leaderboard.find((row) => row.attempt.participantId === attempt.participantId);

  return {
    attempt,
    quiz,
    participant,
    rank: myRow.rank,
    playerCount: leaderboard.length,
    bestAttempt: myRow.attempt, // the attempt the leaderboard counts
  };
}

// The leaderboard page for one quiz
export async function getLeaderboard(quizId) {
  const db = await getDb();
  const quiz = db.quizzes.find((item) => item.id === quizId);
  if (!quiz) return null;

  return {
    quiz: { id: quiz.id, title: quiz.title, timeLimit: quiz.timeLimit, questionCount: quiz.questions.length },
    rows: buildLeaderboard(attemptsFor(db, quiz.id), db.participants),
  };
}
