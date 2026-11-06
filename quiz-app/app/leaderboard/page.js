import { redirect } from "next/navigation";
import { getQuizList } from "@/lib/data";

// "/leaderboard" has no quiz of its own: send people to the first quiz's board
export default async function LeaderboardIndexPage() {
  const quizzes = await getQuizList();
  redirect(`/leaderboard/${quizzes[0].id}`);
}
