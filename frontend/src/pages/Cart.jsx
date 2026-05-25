import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import EditorialPageHero from "../components/EditorialPageHero";
import EmptyState from "../components/EmptyState";
import LuxuryButton from "../components/LuxuryButton";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  return (
    <main className="pb-24">
      <EditorialPageHero
        eyebrow="Panier"
        title="Votre selection parfumee"
        text="Verifiez vos fragrances, ajustez les quantites et poursuivez vers une confirmation WhatsApp simple et rassurante."
        image="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=90"
        meta="La commande finale reste confirmee humainement pour garantir disponibilite, livraison et details."
      />
      <div className="container-page -mt-8">
      {!items.length ? (
        <div className="mt-8"><EmptyState title="Votre panier est vide" text="Ajoutez vos parfums favoris avant de finaliser la commande." action={<LuxuryButton as={Link} to="/catalogue">Voir les parfums</LuxuryButton>} /></div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <CartItem key={item._id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            ))}
          </div>
          <OrderSummary items={items} total={total} />
        </div>
      )}
      </div>
    </main>
  );
};

export default Cart;
