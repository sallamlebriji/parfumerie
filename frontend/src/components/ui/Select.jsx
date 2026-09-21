import { forwardRef, useId } from "react";
import { fieldClass } from "./Input";

// Chaque option est soit une chaîne, soit { value, label } (value peut être "" pour « Tous »).
const normalize = (option) => (typeof option === "object" && option !== null
  ? { value: option.value ?? "", label: option.label ?? String(option.value ?? "") }
  : { value: option, label: option });

export const Select = forwardRef(({ label, options = [], error, className = "", inputClassName = "", ...props }, ref) => {
  const id = useId();
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-2 block text-sm font-semibold text-brand-ink">{label}</label>}
      <select ref={ref} id={id} aria-invalid={error ? "true" : undefined} className={`${fieldClass} appearance-none bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pe-10 ${inputClassName}`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2315130F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...props}>
        {options.map((option) => {
          const { value, label: text } = normalize(option);
          return <option key={String(value)} value={value}>{text}</option>;
        })}
      </select>
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-brand-wine">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";
