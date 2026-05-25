import Perfume from "../models/Perfume.js";
import Sale from "../models/Sale.js";

const scopedQuery = (req) => {
  if (req.user?.role === "SUPER_ADMIN" || !req.tenantId) return {};
  return { tenantId: req.tenantId };
};

export const createSale = async (req, res) => {
  const { perfumeId, quantity, salePrice, paymentMethod, customerName, notes } = req.body;
  if (!perfumeId || !quantity || salePrice === undefined) {
    return res.status(400).json({ message: "Parfum, quantite et prix de vente requis." });
  }

  const perfume = await Perfume.findOne({ _id: perfumeId, ...scopedQuery(req) });
  if (!perfume) return res.status(404).json({ message: "Parfum introuvable." });

  const soldQuantity = Number(quantity);
  const unitSalePrice = Number(salePrice);
  if (soldQuantity < 1) return res.status(400).json({ message: "Quantite invalide." });
  if (perfume.stock < soldQuantity) return res.status(400).json({ message: "Stock insuffisant pour cette vente." });

  const purchasePrice = Number(perfume.purchasePrice || 0);
  const stockBefore = Number(perfume.stock || 0);
  const stockAfter = stockBefore - soldQuantity;
  const totalAmount = unitSalePrice * soldQuantity;
  const totalCost = purchasePrice * soldQuantity;
  const profit = totalAmount - totalCost;

  const sale = await Sale.create({
    perfumeId: perfume._id,
    perfumeName: perfume.name,
    brand: perfume.brand,
    volume: perfume.volume,
    image: perfume.image,
    quantity: soldQuantity,
    stockBefore,
    stockAfter,
    purchasePrice,
    salePrice: unitSalePrice,
    totalAmount,
    totalCost,
    profit,
    paymentMethod,
    customerName,
    notes,
    tenantId: perfume.tenantId || perfume.parfumerie,
    parfumerie: perfume.tenantId || perfume.parfumerie
  });

  perfume.stock = stockAfter;
  perfume.isAvailable = perfume.stock > 0;
  await perfume.save();

  res.status(201).json(sale);
};

export const getSales = async (req, res) => {
  const query = {};
  Object.assign(query, scopedQuery(req));
  if (req.query.perfumeId) query.perfumeId = req.query.perfumeId;
  const sales = await Sale.find(query).sort({ createdAt: -1 }).populate("perfumeId");
  res.json(sales);
};

export const getSaleById = async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, ...scopedQuery(req) }).populate("perfumeId");
  if (!sale) return res.status(404).json({ message: "Vente introuvable." });
  res.json(sale);
};

export const deleteSale = async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!sale) return res.status(404).json({ message: "Vente introuvable." });
  await sale.deleteOne();
  res.json({ message: "Vente supprimee. Le stock n'est pas restaure automatiquement." });
};
