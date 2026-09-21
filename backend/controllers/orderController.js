import Order from "../models/Order.js";
import Perfume from "../models/Perfume.js";
import { sendOrderWhatsApp } from "../services/whatsappService.js";

const validStatuses = ["pending", "confirmed", "cancelled", "delivered"];

const scopedQuery = (req) => {
  if (req.user?.role === "SUPER_ADMIN" || !req.tenantId) return {};
  return { tenantId: req.tenantId };
};

const digitsOf = (value) => String(value || "").replace(/\D/g, "");
export const orderReference = (order) => order._id.toString().slice(-6).toUpperCase();

export const createOrder = async (req, res) => {
  const { customerName, phone, address, city, products, notes } = req.body;
  if (!customerName || !phone || !address || !city || !Array.isArray(products) || !products.length) {
    return res.status(400).json({ message: "Informations de commande incompletes." });
  }
  if (digitsOf(phone).length < 8) return res.status(400).json({ message: "Numero de telephone invalide." });

  const ids = products.map((item) => item.perfumeId);
  const perfumes = await Perfume.find({ _id: { $in: ids } });
  const tenantId = perfumes.find((item) => item.tenantId || item.parfumerie)?.tenantId || perfumes.find((item) => item.parfumerie)?.parfumerie;
  const hasMixedParfumeries = tenantId && perfumes.some((item) => {
    const itemTenantId = item.tenantId || item.parfumerie;
    return itemTenantId && itemTenantId.toString() !== tenantId.toString();
  });
  if (hasMixedParfumeries) return res.status(400).json({ message: "Une commande doit appartenir a une seule parfumerie." });

  const orderProducts = products.map((item) => {
    const perfume = perfumes.find((p) => p._id.toString() === item.perfumeId);
    if (!perfume) throw new Error("Un parfum de la commande est introuvable.");
    const quantity = Math.min(50, Math.max(1, Math.floor(Number(item.quantity || 1))));
    return {
      perfumeId: perfume._id,
      name: perfume.name,
      price: perfume.price,
      quantity,
      volume: perfume.volume,
      image: perfume.image
    };
  });

  const totalAmount = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ customerName, phone, address, city, products: orderProducts, totalAmount, notes, tenantId, parfumerie: tenantId });
  const whatsapp = await sendOrderWhatsApp(order);
  res.status(201).json({ order, reference: orderReference(order), whatsapp });
};

// Suivi public : il faut connaître la référence (6 derniers caractères de l'identifiant) ET le téléphone de la commande.
export const trackOrder = async (req, res) => {
  const reference = String(req.query.ref || "").trim().replace(/^#/, "").toLowerCase();
  const phone = digitsOf(req.query.phone);
  if (!/^[0-9a-f]{6}$/.test(reference) || phone.length < 8) {
    return res.status(400).json({ message: "Reference ou telephone invalide." });
  }

  const candidates = await Order.find({ $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: `${reference}$` } } }).limit(20);
  const order = candidates.find((item) => digitsOf(item.phone).slice(-8) === phone.slice(-8));
  if (!order) return res.status(404).json({ message: "Aucune commande ne correspond a ces informations." });

  res.json({
    reference: orderReference(order),
    status: order.status,
    createdAt: order.createdAt,
    totalAmount: order.totalAmount,
    items: order.products.map(({ name, quantity, volume }) => ({ name, quantity, volume }))
  });
};

export const getOrders = async (req, res) => {
  const query = { ...scopedQuery(req), ...(req.query.status ? { status: req.query.status } : {}) };
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, ...scopedQuery(req) }).populate("products.perfumeId");
  if (!order) return res.status(404).json({ message: "Commande introuvable." });
  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!validStatuses.includes(status)) return res.status(400).json({ message: "Statut invalide." });

  const order = await Order.findOneAndUpdate({ _id: req.params.id, ...scopedQuery(req) }, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Commande introuvable." });
  res.json(order);
};

export const deleteOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!order) return res.status(404).json({ message: "Commande introuvable." });
  await order.deleteOne();
  res.json({ message: "Commande supprimee." });
};
