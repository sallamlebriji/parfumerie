import Order from "../models/Order.js";
import Parfumerie from "../models/Parfumerie.js";
import Perfume from "../models/Perfume.js";
import Sale from "../models/Sale.js";
import Setting from "../models/Setting.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { DEFAULT_ENABLED_MODULES, normalizeRole, ROLES } from "../config/roles.js";

const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

const dayLabel = (date) => date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");

const emptyWeek = () => {
  const today = startOfDay();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return { date, day: dayLabel(date), sales: 0 };
  });
};

const productImage = (image) => image || "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=900&q=85";

const scopedQuery = (req) => {
  if (req.user?.role === "SUPER_ADMIN" || !req.tenantId) return {};
  return { tenantId: req.tenantId };
};

const isSuperAdmin = (req) => normalizeRole(req.user?.role) === ROLES.SUPER_ADMIN;

const userDto = (user) => ({
  id: user._id.toString(),
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: normalizeRole(user.role),
  tenantId: user.tenantId?._id || user.tenantId || user.parfumerie?._id || user.parfumerie || "",
  tenant: user.tenantId?.name || user.parfumerie?.name || "Plateforme",
  parfumerie: user.tenantId?.name || user.parfumerie?.name || "Plateforme",
  isActive: user.isActive,
  createdAt: user.createdAt
});

const resolveUserTenant = (req, body) => {
  if (isSuperAdmin(req)) return body.tenantId || body.parfumerie || null;
  return req.tenantId;
};

const ensureUserLimit = async (tenantId, currentUserId = null) => {
  if (!tenantId) return null;

  const subscription = await Subscription.findOne({ tenantId });
  if (!subscription?.maxUsers) return null;

  const query = { tenantId };
  if (currentUserId) query._id = { $ne: currentUserId };
  const usersCount = await User.countDocuments(query);
  if (usersCount >= subscription.maxUsers) {
    return "Limite d'utilisateurs atteinte pour ce plan.";
  }
  return null;
};

const sanitizeUserRole = (req, role) => {
  const normalized = normalizeRole(role || ROLES.EMPLOYEE);
  if (isSuperAdmin(req)) return normalized;
  if (normalized === ROLES.SUPER_ADMIN) return null;
  return normalized;
};

const toProductDto = (item) => ({
  id: item._id.toString(),
  _id: item._id.toString(),
  name: item.name,
  brand: item.brand,
  description: item.description,
  shortDescription: item.description,
  purchasePrice: item.purchasePrice,
  quantityPurchased: item.quantityPurchased,
  price: item.price,
  oldPrice: item.oldPrice,
  volume: item.volume,
  category: item.category,
  family: item.category,
  gender: item.gender,
  stock: item.stock,
  isAvailable: item.isAvailable,
  isFeatured: item.isFeatured,
  isPromo: Number(item.oldPrice || 0) > Number(item.price || 0),
  isNew: Date.now() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30,
  badge: item.stock <= 0 ? "rupture" : item.isFeatured ? "best-seller" : Number(item.oldPrice || 0) > Number(item.price || 0) ? "promo" : "catalogue",
  rating: 4.7,
  sales: 0,
  image: item.image,
  images: [productImage(item.image)],
  notes: item.notes || { top: "", middle: "", base: "" },
  tenantId: item.tenantId || item.parfumerie,
  parfumerie: item.tenantId || item.parfumerie,
  parfumerieName: item.tenantId?.name || item.parfumerie?.name || "Parfumerie principale",
  createdAt: item.createdAt
});

export const getAdminProducts = async (req, res) => {
  const perfumes = await Perfume.find(scopedQuery(req)).populate("tenantId parfumerie", "name city").sort({ createdAt: -1 });
  res.json(perfumes.map(toProductDto));
};

export const getDashboard = async (req, res) => {
  const today = startOfDay();
  const month = startOfMonth();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const scope = scopedQuery(req);
  const saleScope = scope.tenantId ? { tenantId: scope.tenantId } : {};
  const orderScope = scope.tenantId ? { tenantId: scope.tenantId } : {};

  const settings = await Setting.getForTenant(req.tenantId);
  const lowStockLimit = settings.lowStockThreshold ?? 5;

  const [
    todaySales,
    monthSales,
    orderCount,
    pendingOrders,
    lowStock,
    activeCustomers,
    salesByDayRaw,
    categorySalesRaw,
    totalProfit
  ] = await Promise.all([
    Sale.aggregate([{ $match: { ...saleScope, createdAt: { $gte: today } } }, { $group: { _id: null, value: { $sum: "$totalAmount" } } }]),
    Sale.aggregate([{ $match: { ...saleScope, createdAt: { $gte: month } } }, { $group: { _id: null, value: { $sum: "$totalAmount" } } }]),
    Order.countDocuments(orderScope),
    Order.countDocuments({ ...orderScope, status: "pending" }),
    Perfume.countDocuments({ ...scope, $or: [{ stock: { $lte: lowStockLimit } }, { isAvailable: false }] }),
    Order.distinct("phone", orderScope).then((phones) => phones.length),
    Sale.aggregate([
      { $match: { ...saleScope, createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, sales: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } }
    ]),
    Sale.aggregate([
      { $match: saleScope },
      { $lookup: { from: "perfumes", localField: "perfumeId", foreignField: "_id", as: "perfume" } },
      { $unwind: "$perfume" },
      { $group: { _id: "$perfume.category", value: { $sum: "$totalAmount" } } },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]),
    Sale.aggregate([{ $match: saleScope }, { $group: { _id: null, value: { $sum: "$profit" } } }])
  ]);

  const week = emptyWeek();
  const salesMap = new Map(salesByDayRaw.map((item) => [item._id, item.sales]));
  const salesByDay = week.map((item) => ({
    day: item.day,
    sales: salesMap.get(item.date.toISOString().slice(0, 10)) || 0
  }));

  res.json({
    todayRevenue: todaySales[0]?.value || 0,
    monthRevenue: monthSales[0]?.value || 0,
    orders: orderCount,
    pendingOrders,
    lowStock,
    activeCustomers,
    profit: totalProfit[0]?.value || 0,
    salesByDay,
    categorySales: categorySalesRaw.map((item) => ({ name: item._id || "Sans categorie", value: item.value }))
  });
};

export const getOrdersForAdmin = async (req, res) => {
  const orders = await Order.find(scopedQuery(req)).populate("tenantId parfumerie", "name city").sort({ createdAt: -1 }).limit(250);
  res.json(orders.map((order) => ({
    id: order._id.toString(),
    customer: order.customerName,
    phone: order.phone,
    city: order.city,
    total: order.totalAmount,
    payment: "Livraison",
    delivery: order.city,
    status: order.status,
    tenant: order.tenantId?.name || order.parfumerie?.name || "Parfumerie principale",
    parfumerie: order.tenantId?.name || order.parfumerie?.name || "Parfumerie principale",
    date: order.createdAt?.toLocaleDateString("fr-FR")
  })));
};

export const getCustomers = async (req, res) => {
  const scope = scopedQuery(req);
  const customers = await Order.aggregate([
    ...(scope.tenantId ? [{ $match: { tenantId: scope.tenantId } }] : []),
    {
      $group: {
        _id: "$phone",
        name: { $last: "$customerName" },
        city: { $last: "$city" },
        orders: { $sum: 1 },
        spent: { $sum: "$totalAmount" },
        lastOrder: { $max: "$createdAt" }
      }
    },
    { $sort: { spent: -1 } }
  ]);

  res.json(customers.map((item) => ({
    id: item._id,
    name: item.name,
    phone: item._id,
    email: "-",
    city: item.city,
    orders: item.orders,
    spent: item.spent,
    status: item.spent >= 2000 ? "VIP" : "Actif",
    lastOrder: item.lastOrder?.toLocaleDateString("fr-FR")
  })));
};

export const getStocks = async (req, res) => {
  const settings = await Setting.getForTenant(req.tenantId);
  const threshold = settings.lowStockThreshold ?? 5;
  const perfumes = await Perfume.find(scopedQuery(req)).populate("tenantId parfumerie", "name").sort({ stock: 1, name: 1 });

  res.json(perfumes.map((item) => ({
    id: item._id.toString(),
    sku: item._id.toString().slice(-6).toUpperCase(),
    product: `${item.name} ${item.volume}`,
    available: item.stock,
    threshold,
    status: item.stock <= 0 ? "rupture" : item.stock <= threshold ? "faible" : "ok",
    tenant: item.tenantId?.name || item.parfumerie?.name || "Parfumerie principale",
    parfumerie: item.tenantId?.name || item.parfumerie?.name || "Parfumerie principale",
    in: item.quantityPurchased,
    out: Math.max(Number(item.quantityPurchased || 0) - Number(item.stock || 0), 0)
  })));
};

export const getCategories = async (req, res) => {
  const scope = scopedQuery(req);
  const categories = await Perfume.aggregate([
    ...(scope.tenantId ? [{ $match: { tenantId: scope.tenantId } }] : []),
    { $group: { _id: "$category", products: { $sum: 1 }, stock: { $sum: "$stock" } } },
    { $sort: { _id: 1 } }
  ]);

  res.json(categories.map((item) => ({
    id: item._id,
    name: item._id,
    products: item.products,
    stock: item.stock,
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=85"
  })));
};

export const getBrands = async (req, res) => {
  const scope = scopedQuery(req);
  const brands = await Perfume.aggregate([
    ...(scope.tenantId ? [{ $match: { tenantId: scope.tenantId } }] : []),
    { $group: { _id: "$brand", products: { $sum: 1 }, stock: { $sum: "$stock" } } },
    { $sort: { _id: 1 } }
  ]);

  res.json(brands.map((item) => ({
    id: item._id,
    name: item._id,
    products: item.products,
    stock: item.stock,
    active: item.stock > 0,
    description: `${item.products} parfum(s) en catalogue`
  })));
};

export const getPromotions = async (req, res) => {
  const perfumes = await Perfume.find({ ...scopedQuery(req), oldPrice: { $gt: 0 } }).sort({ createdAt: -1 });
  res.json(perfumes.map((item) => ({
    id: item._id.toString(),
    code: `PROMO-${item.name.slice(0, 4).toUpperCase()}`,
    type: "Remise produit",
    value: Math.max(Number(item.oldPrice || 0) - Number(item.price || 0), 0),
    start: "-",
    end: "-",
    uses: 0,
    min: item.price,
    active: item.isAvailable
  })));
};

export const getSettings = async (req, res) => {
  res.json(await Setting.getForTenant(req.tenantId));
};

export const updateSettings = async (req, res) => {
  const allowed = [
    "shopName",
    "currency",
    "lowStockThreshold",
    "taxRate",
    "deliveryFee",
    "whatsappNumber",
    "orderNotificationNumber",
    "allowOnlineOrders",
    "maintenanceMode",
    "invoicePrefix",
    "address"
  ];
  const payload = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  payload.updatedBy = req.user._id;

  const key = req.tenantId ? `tenant:${req.tenantId}` : "global";
  const settings = await Setting.findOneAndUpdate({ key }, { ...payload, tenantId: req.tenantId || undefined }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  res.json(settings);
};

export const getUsers = async (req, res) => {
  const users = await User.find(scopedQuery(req)).populate("tenantId parfumerie", "name city").select("-password").sort({ createdAt: -1 });
  res.json(users.map(userDto));
};

export const createUser = async (req, res) => {
  const { name, email, password, isActive = true } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Nom, email et mot de passe requis." });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(400).json({ message: "Un utilisateur existe deja avec cet email." });

  const role = sanitizeUserRole(req, req.body.role);
  if (!role) return res.status(403).json({ message: "Role non autorise." });

  const tenantId = resolveUserTenant(req, req.body);
  if (role !== ROLES.SUPER_ADMIN && !tenantId) return res.status(400).json({ message: "Tenant requis pour ce role." });

  const limitError = await ensureUserLimit(tenantId);
  if (limitError) return res.status(403).json({ message: limitError });

  const user = await User.create({
    name,
    email,
    password,
    role,
    tenantId: role === ROLES.SUPER_ADMIN ? undefined : tenantId,
    parfumerie: role === ROLES.SUPER_ADMIN ? undefined : tenantId,
    isActive
  });
  await user.populate("tenantId parfumerie", "name city");
  res.status(201).json(userDto(user));
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
  if (!isSuperAdmin(req) && normalizeRole(user.role) === ROLES.SUPER_ADMIN) return res.status(403).json({ message: "Action interdite." });

  const role = req.body.role !== undefined ? sanitizeUserRole(req, req.body.role) : normalizeRole(user.role);
  if (!role) return res.status(403).json({ message: "Role non autorise." });
  if (user._id.toString() === req.user._id.toString() && (role !== normalizeRole(user.role) || req.body.isActive === false)) {
    return res.status(400).json({ message: "Impossible de modifier votre propre role ou statut." });
  }
  if (req.body.email && req.body.email.toLowerCase() !== user.email) {
    const emailExists = await User.exists({ email: req.body.email.toLowerCase(), _id: { $ne: user._id } });
    if (emailExists) return res.status(400).json({ message: "Un utilisateur existe deja avec cet email." });
  }

  const tenantId = role === ROLES.SUPER_ADMIN ? null : resolveUserTenant(req, req.body) || user.tenantId || user.parfumerie;
  if (role !== ROLES.SUPER_ADMIN && !tenantId) return res.status(400).json({ message: "Tenant requis pour ce role." });

  const limitError = await ensureUserLimit(tenantId, user._id);
  if (limitError) return res.status(403).json({ message: limitError });

  const allowed = ["name", "email", "isActive"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) user[key] = req.body[key];
  }
  user.role = role;
  user.tenantId = role === ROLES.SUPER_ADMIN ? undefined : tenantId;
  user.parfumerie = role === ROLES.SUPER_ADMIN ? undefined : tenantId;
  if (req.body.password) user.password = req.body.password;

  await user.save();
  await user.populate("tenantId parfumerie", "name city");
  res.json(userDto(user));
};

export const toggleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
  if (user._id.toString() === req.user._id.toString()) return res.status(400).json({ message: "Impossible de desactiver votre propre compte." });
  if (!isSuperAdmin(req) && normalizeRole(user.role) === ROLES.ADMIN_TENANT) return res.status(403).json({ message: "Action reservee au superadmin." });

  user.isActive = !user.isActive;
  await user.save();
  await user.populate("tenantId parfumerie", "name city");
  res.json(userDto(user));
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
  if (user._id.toString() === req.user._id.toString()) return res.status(400).json({ message: "Impossible de supprimer votre propre compte." });
  if (!isSuperAdmin(req) && normalizeRole(user.role) === ROLES.ADMIN_TENANT) return res.status(403).json({ message: "Action reservee au superadmin." });

  await user.deleteOne();
  res.json({ message: "Utilisateur supprime." });
};

export const getParfumeries = async (_req, res) => {
  const parfumeries = await Parfumerie.find().sort({ createdAt: -1 });
  const [productCounts, orderCounts] = await Promise.all([
    Perfume.aggregate([{ $match: { tenantId: { $ne: null } } }, { $group: { _id: "$tenantId", products: { $sum: 1 }, stock: { $sum: "$stock" } } }]),
    Order.aggregate([{ $match: { tenantId: { $ne: null } } }, { $group: { _id: "$tenantId", orders: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } }])
  ]);
  const productMap = new Map(productCounts.map((item) => [item._id.toString(), item]));
  const orderMap = new Map(orderCounts.map((item) => [item._id.toString(), item]));

  res.json(parfumeries.map((item) => {
    const id = item._id.toString();
    const products = productMap.get(id);
    const orders = orderMap.get(id);
    return {
      id,
      _id: id,
      name: item.name,
      slug: item.slug,
      city: item.city,
      address: item.address,
      phone: item.phone,
      whatsappNumber: item.whatsappNumber,
      email: item.email,
      managerName: item.managerName,
      isActive: item.isActive,
      products: products?.products || 0,
      stock: products?.stock || 0,
      orders: orders?.orders || 0,
      revenue: orders?.revenue || 0,
      createdAt: item.createdAt
    };
  }));
};

export const createParfumerie = async (req, res) => {
  const { name, slug, city, address, phone, whatsappNumber, email, managerName, isActive, modules } = req.body;
  if (!name) return res.status(400).json({ message: "Nom de parfumerie requis." });
  const parfumerie = await Parfumerie.create({
    name,
    slug,
    city,
    address,
    phone,
    whatsappNumber,
    email,
    managerName,
    modules: modules?.length ? modules : DEFAULT_ENABLED_MODULES,
    isActive: isActive === undefined ? true : isActive,
    createdBy: req.user._id
  });
  await Subscription.findOneAndUpdate(
    { tenantId: parfumerie._id },
    { $setOnInsert: { tenantId: parfumerie._id, plan: "FREE", status: "trial", enabledModules: parfumerie.modules || DEFAULT_ENABLED_MODULES } },
    { upsert: true, new: true }
  );
  await Setting.findOneAndUpdate(
    { key: `tenant:${parfumerie._id}` },
    { $setOnInsert: { key: `tenant:${parfumerie._id}`, tenantId: parfumerie._id, shopName: parfumerie.name } },
    { upsert: true, new: true }
  );
  res.status(201).json(parfumerie);
};

export const updateParfumerie = async (req, res) => {
  const allowed = ["name", "slug", "city", "address", "phone", "whatsappNumber", "email", "managerName", "modules", "isActive"];
  const payload = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  const parfumerie = await Parfumerie.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!parfumerie) return res.status(404).json({ message: "Parfumerie introuvable." });
  res.json(parfumerie);
};

export const deleteParfumerie = async (req, res) => {
  const hasProducts = await Perfume.exists({ $or: [{ tenantId: req.params.id }, { parfumerie: req.params.id }] });
  const hasOrders = await Order.exists({ $or: [{ tenantId: req.params.id }, { parfumerie: req.params.id }] });
  if (hasProducts || hasOrders) {
    return res.status(400).json({ message: "Impossible de supprimer une parfumerie qui contient des parfums ou commandes." });
  }

  const parfumerie = await Parfumerie.findByIdAndDelete(req.params.id);
  if (!parfumerie) return res.status(404).json({ message: "Parfumerie introuvable." });
  await Promise.all([
    Subscription.deleteOne({ tenantId: req.params.id }),
    Setting.deleteMany({ tenantId: req.params.id }),
    User.deleteMany({ tenantId: req.params.id })
  ]);
  res.json({ message: "Parfumerie supprimee." });
};
