"use client";

import React from "react";
import { useFormState } from "react-dom";
import Field from "@/components/ui/Field";
import SubmitButton, { FormMessage } from "./SubmitButton";
import { updateBooking, resendBookingEmail, type ActionState } from "@/app/admin/actions";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/types";

export default function BookingStatusForm({ id, status, adminNotes }: { id: string; status: string; adminNotes: string }) {
  const [state, action] = useFormState<ActionState, FormData>(updateBooking, {});
  const [resendState, resendAction] = useFormState<ActionState, FormData>(resendBookingEmail, {});

  return (
    <div className="space-y-6">
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

      <form action={resendAction} className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h3 className="font-semibold text-slate-900">Resend confirmation</h3>
          <p className="text-xs text-slate-500">Send another copy of the booking confirmation email to the traveller.</p>
        </div>
        <input type="hidden" name="id" value={id} />
        <div className="flex items-center gap-3">
          <FormMessage state={resendState} />
          <button type="submit" className="btn-secondary btn-sm">
            Resend email
          </button>
        </div>
      </form>
    </div>
  );
}
