import { Minus, Plus, Trash2 } from "lucide-react";
import { uploadsUrl } from "../api/axios";

const imageSrc = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80";
  if (image.startsWith("http")) return image;
  return `${uploadsUrl}${image.replace("/uploads", "")}`;
};

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="panel flex flex-wrap items-center justify-between gap-5 p-5">
    <div className="flex items-center gap-4">
      <img src={imageSrc(item.image)} alt={item.name} className="h-24 w-24 rounded-2xl object-cover shadow-soft" />
      <div>
        <h2 className="text-lg font-bold">{item.name}</h2>
        <p className="text-sm text-elegantgray">{item.brand} - {item.volume} - {item.price} DH</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button className="rounded-full border border-ink/10 p-2 hover:border-gold" onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={16} /></button>
      <span className="w-8 text-center font-bold">{item.quantity}</span>
      <button className="rounded-full border border-ink/10 p-2 hover:border-gold" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={16} /></button>
      <p className="w-28 font-bold text-gold">{item.price * item.quantity} DH</p>
      <button className="rounded-full border border-red-200 p-3 text-red-600" onClick={() => removeFromCart(item._id)} aria-label="Supprimer"><Trash2 size={18} /></button>
    </div>
  </div>
);

export default CartItem;
