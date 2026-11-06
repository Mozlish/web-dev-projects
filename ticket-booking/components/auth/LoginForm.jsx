"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Field from "@/components/Field";
import SubmitButton from "@/components/SubmitButton";

const initialState = { error: null, values: {} };

export default function LoginForm({ nextPath }) {
  // state = whatever login() returned last time: { error, values }
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {/* Sent along with the form, so the action knows where to go next */}
      <input type="hidden" name="next" value={nextPath} />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        autoFocus
        defaultValue={state.values.email}
      />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />

      <p className="min-h-5 text-sm text-rose-400" aria-live="polite">
        {state.error}
      </p>

      <SubmitButton pendingText="Logging in..." className="w-full py-3">
        Log in
      </SubmitButton>
    </form>
  );
}
