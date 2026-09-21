import { formatPrice, orderReference } from "./format";

// Les libellés envoyés à la boutique restent en français : c'est la langue de gestion des commandes.
export const deliveryLabels = { home: "Livraison à domicile", pickup: "Retrait en boutique" };
export const paymentLabels = { cash: "Paiement à la livraison", transfer: "Virement bancaire" };

export const buildOrderNotes = ({ delivery, payment, notes }) =>
  [deliveryLabels[delivery], paymentLabels[payment], notes?.trim()].filter(Boolean).join(" · ");

export const buildOrderMessage = ({ id, values, cart, total }) => {
  const lines = cart.map((line, index) => `${index + 1}. ${line.name} — ${line.volume} × ${line.quantity} — ${formatPrice(line.price * line.quantity)}`).join("\n");
  const where = values.delivery === "pickup" ? deliveryLabels.pickup : `${deliveryLabels.home} — ${values.address}, ${values.city}`;
  const ref = id ? ` ${orderReference(id)}` : "";
  return [
    `Bonjour, je souhaite confirmer ma commande${ref} :`,
    "",
    `Nom : ${values.fullName}`,
    `Téléphone : ${values.phone}`,
    `Livraison : ${where}`,
    `Paiement : ${paymentLabels[values.payment]}`,
    values.notes?.trim() ? `Note : ${values.notes.trim()}` : null,
    "",
    "Commande :",
    lines,
    "",
    `Total : ${formatPrice(total)}`,
    "",
    "Merci de confirmer la disponibilité."
  ].filter((line) => line !== null).join("\n");
};
