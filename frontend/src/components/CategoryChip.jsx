const CategoryChip = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-sm font-bold transition duration-300 ${
      active ? "border-gold bg-gold text-ink shadow-soft" : "border-ink/10 bg-white/80 text-ink/70 hover:border-gold hover:text-ink"
    }`}
  >
    {children}
  </button>
);

export default CategoryChip;
