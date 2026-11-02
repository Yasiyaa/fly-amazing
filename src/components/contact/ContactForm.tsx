"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Field from "@/components/ui/Field";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "We couldn't send your message. Please try again.");
      setReference(json.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-xl font-bold text-slate-900">Message received</h3>
        <p className="mt-2 text-sm text-slate-500">
          Your reference is <span className="font-semibold text-fly-navy-900">{reference}</span>. We&rsquo;ll reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="ct-name" label="Full name">
          <input id="ct-name" required autoComplete="name" value={form.name} onChange={set("name")} className="field-input" />
        </Field>
        <Field id="ct-email" label="Email">
          <input id="ct-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className="field-input" />
        </Field>
      </div>
      <Field id="ct-phone" label="Phone or WhatsApp" optional>
        <input id="ct-phone" type="tel" autoComplete="tel" placeholder="Include country code" value={form.phone} onChange={set("phone")} className="field-input" />
      </Field>
      <Field id="ct-message" label="How can we help?">
        <textarea
          id="ct-message"
          rows={5}
          required
          value={form.message}
          onChange={set("message")}
          placeholder="e.g. Two weeks in February for four adults, with Sigiriya, Ella and a safari."
          className="field-input resize-none"
        />
      </Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />
      <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
