"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import Field from "@/components/Field";
import SubmitButton from "@/components/SubmitButton";

const initialState = { errors: {}, values: {} };

export default function RegisterForm({ nextPath }) {
  // state = { errors: { email: "..." }, values: { name, email, phone } }
  const [state, formAction] = useActionState(register, initialState);
  const { errors, values } = state;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        required
        autoFocus
        defaultValue={values.name}
        error={errors.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={values.email}
        error={errors.email}
      />
      <Field
        label="Mobile number"
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="01712345678"
        required
        defaultValue={values.phone}
        error={errors.phone}
        hint="Your tickets are sent to this number."
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        error={errors.password}
        hint="At least 8 characters."
      />

      <SubmitButton pendingText="Creating your account..." className="w-full py-3">
        Create account
      </SubmitButton>
    </form>
  );
}
