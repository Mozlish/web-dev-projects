"use client";

import { useActionState } from "react";
import { joinQuiz } from "@/app/actions";
import SubmitButton from "./SubmitButton";

const initialState = { error: null, name: "" };

export default function JoinForm({ nextPath }) {
  // state = whatever joinQuiz returned last time: { error, name }
  const [state, formAction] = useActionState(joinQuiz, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Sent along with the name, so the action knows where to go next */}
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={30}
          autoComplete="name"
          autoFocus
          placeholder="e.g. Rafi Ahmed"
          defaultValue={state.name}
          aria-describedby="name-help"
          className="w-full rounded-lg bg-field px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-brand"
        />
        <p id="name-help" className="text-xs text-gray-500">
          Already played? Type the same name to continue with your scores.
        </p>
      </div>

      <p className="min-h-5 text-sm text-rose-400" aria-live="polite">
        {state.error}
      </p>

      <SubmitButton pendingText="Joining..." className="w-full py-3">
        Start playing
      </SubmitButton>
    </form>
  );
}
