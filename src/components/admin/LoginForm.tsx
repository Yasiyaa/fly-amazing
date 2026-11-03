"use client";

import React from "react";
import { useFormState } from "react-dom";
import Field from "@/components/ui/Field";
import SubmitButton, { FormMessage } from "./SubmitButton";
import { signIn, type ActionState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action] = useFormState<ActionState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <Field id="email" label="Email">
        <input id="email" name="email" type="email" required autoComplete="username" className="field-input" />
      </Field>
      <Field id="password" label="Password">
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field-input" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
