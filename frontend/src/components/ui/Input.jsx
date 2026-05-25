export const Input = ({ label, error, className = "", ...props }) => (
  <label className="block">
    {label && <span className="mb-2 block text-sm font-bold text-[#0B0B0F]">{label}</span>}
    <input className={`w-full rounded-2xl border border-black/10 bg-white/85 px-4 py-3 text-sm outline-none transition focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/15 ${className}`} {...props} />
    {error && <span className="mt-2 block text-xs font-semibold text-[#DC2626]">{error}</span>}
  </label>
);
