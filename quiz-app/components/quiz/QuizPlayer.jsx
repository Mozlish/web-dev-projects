"use client";

import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { submitQuiz } from "@/app/actions";
import { formatTime, quizThemes } from "@/lib/quiz";
import QuestionCard from "./QuestionCard";
import QuizSidebar from "./QuizSidebar";

// The screen before the clock starts
function QuizIntro({ quiz, playerName, onStart }) {
  const theme = quizThemes[quiz.color];

  const rules = [
    `${quiz.questions.length} questions, one answer each`,
    `${formatTime(quiz.timeLimit)} minutes for the whole quiz. When time runs out, your answers are sent`,
    "Move between questions freely; a skipped question counts as wrong",
    "Your best attempt is the one on the leaderboard",
  ];

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-line bg-card">
      <div className={`bg-linear-to-br px-6 py-10 md:px-10 ${theme.cover}`}>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>{quiz.level}</span>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">{quiz.title}</h1>
        <p className="mt-2 text-gray-300">Good luck, {playerName}!</p>
      </div>

      <div className="p-6 md:p-10">
        <h2 className="font-semibold">Before you start</h2>
        <ul className="mt-4 space-y-3 text-gray-300">
          {rules.map((rule) => (
            <li key={rule} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              {rule}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 w-full rounded-lg bg-brand px-5 py-3 font-semibold transition hover:bg-brand-dark"
        >
          Start the timer
        </button>
      </div>
    </div>
  );
}

export default function QuizPlayer({ quiz, playerName }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { q1: "b", q3: "a" }
  const [secondsLeft, setSecondsLeft] = useState(quiz.timeLimit);
  const [isSubmitting, startSubmitting] = useTransition();

  // Derived values: worked out from state on every render
  const total = quiz.questions.length;
  const question = quiz.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  function selectAnswer(optionId) {
    setAnswers({ ...answers, [question.id]: optionId });
  }

  function submitAnswers() {
    if (isSubmitting) return; // already on its way
    startSubmitting(async () => {
      // The Server Action grades, saves and redirects to the result page
      await submitQuiz(quiz.id, answers, quiz.timeLimit - secondsLeft);
    });
  }

  function handleSubmitClick() {
    const unanswered = total - answeredCount;
    if (unanswered > 0) {
      const message = `You have ${unanswered} unanswered ${unanswered === 1 ? "question" : "questions"}. Submit anyway?`;
      if (!window.confirm(message)) return;
    }
    submitAnswers();
  }

  // 1. The countdown: one tick per second while the quiz runs
  useEffect(() => {
    if (!hasStarted) return;

    const timerId = setInterval(() => {
      // Functional update: always counts down from the latest value
      setSecondsLeft((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    // Cleanup: stop this timer when the component goes away
    return () => clearInterval(timerId);
  }, [hasStarted]);

  // 2. Time's up: send whatever is answered.
  //    useEffectEvent reads the LATEST answers without making the effect re-run on every click.
  const onTimeUp = useEffectEvent(() => {
    submitAnswers();
  });

  useEffect(() => {
    if (hasStarted && secondsLeft === 0) onTimeUp();
  }, [hasStarted, secondsLeft]);

  // 3. Closing or reloading the tab mid-quiz asks "Leave site?" first
  useEffect(() => {
    if (!hasStarted || isSubmitting) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasStarted, isSubmitting]);

  if (!hasStarted) {
    return <QuizIntro quiz={quiz} playerName={playerName} onStart={() => setHasStarted(true)} />;
  }

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* On phones the sidebar (with the timer) comes first; on large screens it moves right */}
        <div className="lg:order-2">
          <QuizSidebar
            playerName={playerName}
            secondsLeft={secondsLeft}
            timeLimit={quiz.timeLimit}
            questions={quiz.questions}
            answers={answers}
            currentIndex={currentIndex}
            onJump={setCurrentIndex}
            onSubmit={handleSubmitClick}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-400">{quiz.title}</p>
            {/* Progress bar: how many are answered */}
            <div className="mt-3 h-2 rounded-full bg-field">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </div>
          </div>

          <QuestionCard
            question={question}
            number={currentIndex + 1}
            total={total}
            selected={answers[question.id]}
            onSelect={selectAnswer}
          />

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={isFirst}
              className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-field disabled:pointer-events-none disabled:opacity-40"
            >
              Previous
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                Finish quiz
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold transition hover:bg-brand-dark"
              >
                Next question
              </button>
            )}
          </div>
        </div>
      </div>

      {/* While the answers are being checked, cover the page */}
      {isSubmitting && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-page/85 backdrop-blur-sm"
          role="status"
        >
          <div className="text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-field border-t-brand" />
            <p className="mt-4 text-lg font-semibold">
              {secondsLeft === 0 ? "Time's up! " : ""}Checking your answers...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
