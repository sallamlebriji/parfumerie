const ProductBadge = ({ children, tone = "gold" }) => {
  const styles = {
    gold: "border-gold/30 bg-gold/10 text-gold",
    dark: "border-ink/10 bg-ink text-white",
    green: "border-whatsapp/30 bg-whatsapp/10 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700"
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${styles[tone]}`}>{children}</span>;
};

export default ProductBadge;
