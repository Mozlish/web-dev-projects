// Quiz rules and helpers in plain JavaScript: grading, ranking, formatting.
// No React and no secrets here, so both the server and the browser may import it.

// ----- 1. Colours for each quiz (full class names, so Tailwind can find them) -----
export const quizThemes = {
  amber: {
    cover: "from-amber-400/35 via-orange-500/15 to-transparent",
    text: "text-amber-300",
    badge: "bg-amber-400/15 text-amber-300",
  },
  sky: {
    cover: "from-sky-400/35 via-cyan-500/15 to-transparent",
    text: "text-sky-300",
    badge: "bg-sky-400/15 text-sky-300",
  },
  violet: {
    cover: "from-violet-400/35 via-fuchsia-500/15 to-transparent",
    text: "text-violet-300",
    badge: "bg-violet-400/15 text-violet-300",
  },
};

// ----- 2. Grading -----
// answers = what the player picked: { q1: "b", q2: "c" }
// Returns the score, the number of questions, and the answers we keep.
export function gradeAnswers(quiz, answers) {
  const keptAnswers = {};
  let score = 0;

  for (const question of quiz.questions) {
    const picked = answers?.[question.id];

    // Keep only real option ids: anything else the browser sent is ignored
    if (question.options.some((option) => option.id === picked)) {
      keptAnswers[question.id] = picked;
      if (picked === question.answer) score += 1;
    }
  }

  return { score, total: quiz.questions.length, answers: keptAnswers };
}

// 4 out of 5 -> 80
export function getPercent(score, total) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

// A label and a colour for a percentage
export function getGrade(percent) {
  if (percent >= 80) return { label: "Excellent!", color: "text-emerald-400", ring: "stroke-emerald-400" };
  if (percent >= 50) return { label: "Good job", color: "text-amber-300", ring: "stroke-amber-300" };
  return { label: "Keep practising", color: "text-rose-400", ring: "stroke-rose-400" };
}

// ----- 3. The leaderboard -----

// Higher score first. Same score? Faster time first.
// A negative result puts a first, a positive one puts b first, 0 = a tie.
export function compareAttempts(a, b) {
  return b.score - a.score || a.timeTaken - b.timeTaken;
}

// attempts = every attempt at ONE quiz.
// Keeps each participant's best attempt, sorts them and gives each a rank.
export function buildLeaderboard(attempts, participants) {
  const best = {}; // { participantId: their best attempt }
  const plays = {}; // { participantId: how many times they played }

  for (const attempt of attempts) {
    const id = attempt.participantId;
    plays[id] = (plays[id] ?? 0) + 1;
    if (!best[id] || compareAttempts(attempt, best[id]) < 0) {
      best[id] = attempt;
    }
  }

  const sorted = Object.values(best).toSorted(compareAttempts);

  // Equal score AND time share a rank, and the next rank skips: 1, 2, 3, 3, 5
  let rank = 0;
  return sorted.map((attempt, index) => {
    const previous = sorted[index - 1];
    if (!previous || compareAttempts(previous, attempt) !== 0) rank = index + 1;

    return {
      rank,
      attempt,
      participant: participants.find((person) => person.id === attempt.participantId),
      plays: plays[attempt.participantId],
    };
  });
}

// ----- 4. Formatting -----

// 150 -> "2:30", 7 -> "0:07"
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// "Maya Chen" -> "MC"
export function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
