"use client";

import React from "react";
import { useFormState } from "react-dom";
import Field from "@/components/ui/Field";
import SubmitButton, { FormMessage } from "./SubmitButton";
import { updateBooking, type ActionState } from "@/app/admin/actions";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/types";

export default function BookingStatusForm({ id, status, adminNotes }: { id: string; status: string; adminNotes: string }) {
  const [state, action] = useFormState<ActionState, FormData>(updateBooking, {});
  return (
    <form action={action} className="card space-y-4 p-6">
      <h2 className="font-semibold text-slate-900">Update booking</h2>
      <input type="hidden" name="id" value={id} />
      <Field id="status" label="Status">
        <select id="status" name="status" defaultValue={status} className="field-input cursor-pointer">
          {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((s) => (
            <option key={s} value={s}>
              {BOOKING_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </Field>
      <Field id="adminNotes" label="Internal notes" optional>
        <textarea id="adminNotes" name="adminNotes" rows={3} defaultValue={adminNotes} className="field-input" />
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="notify" className="h-4 w-4 rounded border-slate-300" />
        Email the traveller about this change
      </label>
      <Field id="message" label="Message to include in the email" optional>
        <textarea id="message" name="message" rows={3} placeholder="e.g. Payment link, final price, next steps" className="field-input" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
