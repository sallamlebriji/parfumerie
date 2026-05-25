import Order from "../models/Order.js";
import Perfume from "../models/Perfume.js";
import { sendOrderWhatsApp } from "../services/whatsappService.js";

const validStatuses = ["pending", "confirmed", "cancelled", "delivered"];

const scopedQuery = (req) => {
  if (req.user?.role === "SUPER_ADMIN" || !req.tenantId) return {};
  return { tenantId: req.tenantId };
};

export const createOrder = async (req, res) => {
  const { customerName, phone, address, city, products, notes } = req.body;
  if (!customerName || !phone || !address || !city || !Array.isArray(products) || !products.length) {
    return res.status(400).json({ message: "Informations de commande incompletes." });
  }

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
    const quantity = Math.max(1, Number(item.quantity || 1));
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
  res.status(201).json({ order, whatsapp });
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
