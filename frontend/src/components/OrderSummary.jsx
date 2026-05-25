import { Link } from "react-router-dom";

const OrderSummary = ({ items, total, checkout = false }) => (
  <aside className="sticky top-28 h-fit rounded-[28px] border border-gold/35 bg-ink p-7 text-white shadow-luxury">
    <p className="text-sm text-white/60">Resume commande</p>
    <div className="mt-5 grid gap-3">
      {items.map((item) => <p key={item._id} className="flex justify-between gap-4 text-sm text-white/75"><span>{item.name} x {item.quantity}</span><span>{item.price * item.quantity} DH</span></p>)}
    </div>
    <div className="my-6 h-px bg-gold/30" />
    <div className="flex items-end justify-between">
      <span className="text-white/60">Total</span>
      <strong className="text-3xl text-lightgold">{total} DH</strong>
    </div>
    {!checkout && <Link to="/commande" className="btn-gold mt-6 w-full">Passer la commande</Link>}
    {!checkout && <Link to="/catalogue" className="mt-3 inline-flex w-full justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/80 hover:border-gold">Continuer mes achats</Link>}
  </aside>
);

export default OrderSummary;
