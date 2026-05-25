import { Trash2 } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { formatPrice } from "../../utils/format";
import { QuantitySelector } from "./QuantitySelector";

export const CartItem = ({ item }) => {
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#C8A96A]/15 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img src={item.images[0]} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
        <div>
          <h3 className="font-title text-xl font-black">{item.name}</h3>
          <p className="text-sm text-[#8A8A8A]">{item.brand} - {item.volume}</p>
          <p className="mt-1 font-bold text-[#C8A96A]">{formatPrice(item.price)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <QuantitySelector value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} />
        <strong>{formatPrice(item.price * item.quantity)}</strong>
        <button className="rounded-full border border-red-200 p-3 text-red-600" onClick={() => removeFromCart(item.id)}><Trash2 size={18} /></button>
      </div>
    </div>
  );
};
