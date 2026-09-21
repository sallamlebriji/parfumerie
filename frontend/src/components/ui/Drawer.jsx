import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

export const Drawer = ({ open, title, children, footer, onClose, closeLabel = "Fermer" }) => {
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

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button type="button" tabIndex={-1} aria-label={closeLabel} onClick={onClose} className={`absolute inset-0 bg-brand-night/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-brand-ivory shadow-2xl outline-none transition-transform duration-300 ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-brand-ink/10 px-6 py-5">
          <h2 id={titleId} className="font-display text-2xl font-medium">{title}</h2>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="rounded-full p-2 transition hover:bg-brand-ink/5"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="border-t border-brand-ink/10 px-6 py-4">{footer}</div>}
      </aside>
    </div>
  );
};
