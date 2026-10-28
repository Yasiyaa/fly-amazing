import React from "react";

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Label + control wrapper used by every enquiry form. */
export default function Field({ id, label, optional, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="font-normal text-slate-400"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}
