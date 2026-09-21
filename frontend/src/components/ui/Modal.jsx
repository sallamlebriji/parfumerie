import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

export const Modal = ({ open, title, children, onClose, closeLabel = "Fermer" }) => {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => { if (event.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-night/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-brand-ivory p-6 shadow-2xl outline-none">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 id={titleId} className="font-display text-2xl font-semibold">{title}</h3>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="rounded-full p-2 text-brand-ink/70 transition hover:bg-brand-ink/5 hover:text-brand-ink"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};
