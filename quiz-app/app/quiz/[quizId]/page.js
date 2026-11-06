import { notFound } from "next/navigation";
import { getQuizForPlayer } from "@/lib/data";
import { requireParticipant } from "@/lib/participant";
import QuizPlayer from "@/components/quiz/QuizPlayer";

export async function generateMetadata({ params }) {
  const { quizId } = await params;
  const quiz = await getQuizForPlayer(quizId);
  return { title: quiz ? quiz.title : "Quiz not found" };
}

// Page 2: play one quiz, at "/quiz/[quizId]"
export default async function QuizPage({ params }) {
  const { quizId } = await params; // "/quiz/react-fundamentals" -> "react-fundamentals"

  const quiz = await getQuizForPlayer(quizId);
  if (!quiz) notFound();

  // Not joined yet? Go to /join, then come straight back here
  const participant = await requireParticipant(`/quiz/${quizId}`);

  return <QuizPlayer quiz={quiz} playerName={participant.name} />;
}
