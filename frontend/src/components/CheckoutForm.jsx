import { MapPin, MessageCircle, Phone, User } from "lucide-react";

const fields = [
  ["customerName", "Nom complet", User],
  ["phone", "Telephone", Phone],
  ["address", "Adresse", MapPin],
  ["city", "Ville", MapPin]
];

const CheckoutForm = ({ form, update, submit, error }) => (
  <form onSubmit={submit} className="glass-panel grid gap-5 p-6">
    {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    {fields.map(([key, label, Icon]) => (
      <label key={key}>
        <span className="label">{label}</span>
        <div className="relative">
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-elegantgray" size={17} />
          <input className="field pl-11" required value={form[key]} onChange={(e) => update(key, e.target.value)} />
        </div>
      </label>
    ))}
    <label><span className="label">Notes supplementaires</span><textarea className="field min-h-28" value={form.notes} onChange={(e) => update("notes", e.target.value)} /></label>
    <button className="btn-whatsapp"><MessageCircle size={18} /> Confirmer sur WhatsApp</button>
  </form>
);

export default CheckoutForm;
