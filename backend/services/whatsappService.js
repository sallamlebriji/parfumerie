const buildOrderMessage = (order) => {
  const lines = order.products
    .map((item, index) => `${index + 1}. ${item.name} - ${item.volume} - Quantite : ${item.quantity} - Prix : ${item.price * item.quantity} DH`)
    .join("\n");

  return `Bonjour, je souhaite confirmer cette commande :\n\nNom : ${order.customerName}\nTelephone : ${order.phone}\nAdresse : ${order.address}, ${order.city}\n\nCommande :\n${lines}\n\nTotal : ${order.totalAmount} DH\n\nMerci de confirmer la disponibilite.`;
};

export const sendOrderWhatsApp = async (order) => {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_ORDER_TO_NUMBER || process.env.WHATSAPP_NUMBER;
  const apiVersion = process.env.WHATSAPP_CLOUD_API_VERSION || "v20.0";

  if (!token || !phoneNumberId || !recipient) {
    return {
      sent: false,
      message: buildOrderMessage(order),
      reason: "WhatsApp Cloud API non configuree. Ajoutez WHATSAPP_CLOUD_TOKEN, WHATSAPP_PHONE_NUMBER_ID et WHATSAPP_ORDER_TO_NUMBER."
    };
  }

  const message = buildOrderMessage(order);
  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "text",
      text: { preview_url: false, body: message }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    return {
      sent: false,
      message,
      reason: data.error?.message || "Echec envoi WhatsApp Cloud API.",
      providerResponse: data
    };
  }

  return { sent: true, message, providerResponse: data };
};
