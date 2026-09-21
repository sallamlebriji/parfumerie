import { forwardRef, useId } from "react";

export const fieldClass = "w-full rounded-xl border border-brand-ink/15 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/70 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 aria-[invalid=true]:border-brand-wine";

const Field = ({ id, label, error, hint, className, children }) => (
  <div className={className}>
    {label && <label htmlFor={id} className="mb-2 block text-sm font-semibold text-brand-ink">{label}</label>}
    {children}
    {hint && !error && <p id={`${id}-hint`} className="mt-2 text-xs text-brand-muted">{hint}</p>}
    {error && <p id={`${id}-error`} role="alert" className="mt-2 text-xs font-semibold text-brand-wine">{error}</p>}
  </div>
);

export const Input = forwardRef(({ label, error, hint, className = "", inputClassName = "", ...props }, ref) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <input ref={ref} id={id} aria-invalid={error ? "true" : undefined} aria-describedby={describedBy} className={`${fieldClass} ${inputClassName}`} {...props} />
    </Field>
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef(({ label, error, hint, className = "", inputClassName = "", rows = 3, ...props }, ref) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <textarea ref={ref} id={id} rows={rows} aria-invalid={error ? "true" : undefined} aria-describedby={describedBy} className={`${fieldClass} resize-y ${inputClassName}`} {...props} />
    </Field>
  );
});
Textarea.displayName = "Textarea";
