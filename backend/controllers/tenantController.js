import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { DEFAULT_ENABLED_MODULES, ROLES } from "../config/roles.js";
import Order from "../models/Order.js";
import Parfumerie from "../models/Parfumerie.js";
import Perfume from "../models/Perfume.js";
import Sale from "../models/Sale.js";
import Setting from "../models/Setting.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

const slugify = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const uniqueSlug = async (name) => {
  const base = slugify(name) || "tenant";
  let slug = base;
  let index = 2;
  while (await Parfumerie.exists({ slug })) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
};

const tenantDto = (tenant, subscription) => ({
  id: tenant._id.toString(),
  _id: tenant._id.toString(),
  name: tenant.name,
  slug: tenant.slug,
  email: tenant.email,
  phone: tenant.phone,
  address: tenant.address,
  logo: tenant.logo,
  primaryColor: tenant.primaryColor,
  city: tenant.city,
  managerName: tenant.managerName,
  modules: tenant.modules || subscription?.enabledModules || DEFAULT_ENABLED_MODULES,
  isActive: tenant.isActive,
  subscription,
  createdAt: tenant.createdAt,
  updatedAt: tenant.updatedAt
});

export const listTenants = async (_req, res) => {
  const tenants = await Parfumerie.find().sort({ createdAt: -1 });
  const subscriptions = await Subscription.find({ tenantId: { $in: tenants.map((item) => item._id) } });
  const subMap = new Map(subscriptions.map((item) => [item.tenantId.toString(), item]));
  res.json(tenants.map((tenant) => tenantDto(tenant, subMap.get(tenant._id.toString()))));
};

export const getTenant = async (req, res) => {
  const tenant = await Parfumerie.findById(req.params.id);
  if (!tenant) return res.status(404).json({ message: "Tenant introuvable." });
  const subscription = await Subscription.findOne({ tenantId: tenant._id });
  res.json(tenantDto(tenant, subscription));
};

export const provisionTenant = async (req, res) => {
  const { tenant = {}, admin = {}, subscription = {}, seedSampleData = false } = req.body;
  if (!tenant.name) return res.status(400).json({ message: "Nom du tenant requis." });
  if (!admin.email || !admin.password) return res.status(400).json({ message: "Email et mot de passe admin requis." });
  if (await User.exists({ email: admin.email.toLowerCase() })) {
    return res.status(400).json({ message: "Un utilisateur existe deja avec cet email." });
  }

  const createdTenant = await Parfumerie.create({
    name: tenant.name,
    slug: tenant.slug || await uniqueSlug(tenant.name),
    email: tenant.email || admin.email,
    phone: tenant.phone || "",
    address: tenant.address || "",
    logo: tenant.logo || "",
    primaryColor: tenant.primaryColor || "#D8B87E",
    city: tenant.city || "",
    managerName: admin.name || tenant.managerName || "",
    modules: subscription.enabledModules || tenant.modules || DEFAULT_ENABLED_MODULES,
    isActive: tenant.isActive !== false,
    createdBy: req.user._id
  });

  const createdSubscription = await Subscription.create({
    tenantId: createdTenant._id,
    plan: subscription.plan || "FREE",
    status: subscription.status || "trial",
    startDate: subscription.startDate || new Date(),
    endDate: subscription.endDate,
    maxUsers: subscription.maxUsers || 3,
    maxStorage: subscription.maxStorage || 512,
    maxItems: subscription.maxItems || 100,
    enabledModules: subscription.enabledModules || DEFAULT_ENABLED_MODULES
  });

  const createdAdmin = await User.create({
    name: admin.name || "Administrateur tenant",
    email: admin.email,
    password: admin.password,
    role: ROLES.ADMIN_TENANT,
    tenantId: createdTenant._id,
    parfumerie: createdTenant._id,
    isActive: true
  });

  await Setting.findOneAndUpdate(
    { key: `tenant:${createdTenant._id}` },
    {
      key: `tenant:${createdTenant._id}`,
      tenantId: createdTenant._id,
      shopName: createdTenant.name,
      whatsappNumber: createdTenant.whatsappNumber || createdTenant.phone || "",
      orderNotificationNumber: createdTenant.whatsappNumber || createdTenant.phone || ""
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  if (seedSampleData) {
    await Perfume.create({
      name: "Signature Sample",
      brand: createdTenant.name,
      description: "Produit exemple cree pendant le provisioning SaaS.",
      price: 100,
      volume: "50ml",
      category: "Demo",
      stock: 10,
      tenantId: createdTenant._id,
      parfumerie: createdTenant._id
    });
  }

  res.status(201).json({
    tenant: tenantDto(createdTenant, createdSubscription),
    admin: { id: createdAdmin._id, name: createdAdmin.name, email: createdAdmin.email, role: createdAdmin.role, tenantId: createdTenant._id }
  });
};

export const updateTenant = async (req, res) => {
  const allowed = ["name", "slug", "email", "phone", "whatsappNumber", "address", "logo", "primaryColor", "city", "managerName", "modules", "isActive"];
  const payload = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  const tenant = await Parfumerie.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!tenant) return res.status(404).json({ message: "Tenant introuvable." });

  if (req.body.subscription) {
    await Subscription.findOneAndUpdate({ tenantId: tenant._id }, req.body.subscription, { upsert: true, new: true, runValidators: true });
  }
  const subscription = await Subscription.findOne({ tenantId: tenant._id });
  res.json(tenantDto(tenant, subscription));
};

export const toggleTenant = async (req, res) => {
  const tenant = await Parfumerie.findById(req.params.id);
  if (!tenant) return res.status(404).json({ message: "Tenant introuvable." });
  tenant.isActive = !tenant.isActive;
  await tenant.save();
  res.json(tenantDto(tenant, await Subscription.findOne({ tenantId: tenant._id })));
};

export const deleteTenant = async (req, res) => {
  const [hasProducts, hasOrders, hasSales] = await Promise.all([
    Perfume.exists({ $or: [{ tenantId: req.params.id }, { parfumerie: req.params.id }] }),
    Order.exists({ $or: [{ tenantId: req.params.id }, { parfumerie: req.params.id }] }),
    Sale.exists({ $or: [{ tenantId: req.params.id }, { parfumerie: req.params.id }] })
  ]);
  if (hasProducts || hasOrders || hasSales) return res.status(400).json({ message: "Impossible de supprimer un tenant qui contient des donnees metier." });

  await Promise.all([
    Parfumerie.findByIdAndDelete(req.params.id),
    Subscription.deleteOne({ tenantId: req.params.id }),
    Setting.deleteMany({ tenantId: req.params.id }),
    User.deleteMany({ tenantId: req.params.id })
  ]);
  res.json({ message: "Tenant supprime." });
};

export const tenantStats = async (req, res) => {
  const tenantId = new mongoose.Types.ObjectId(req.params.id);
  const [users, products, orders, sales, revenue] = await Promise.all([
    User.countDocuments({ tenantId }),
    Perfume.countDocuments({ tenantId }),
    Order.countDocuments({ tenantId }),
    Sale.countDocuments({ tenantId }),
    Sale.aggregate([{ $match: { tenantId } }, { $group: { _id: null, value: { $sum: "$totalAmount" } } }])
  ]);
  res.json({ users, products, orders, sales, revenue: revenue[0]?.value || 0 });
};

export const impersonateTenant = async (req, res) => {
  const admin = await User.findOne({ tenantId: req.params.id, role: ROLES.ADMIN_TENANT, isActive: true });
  if (!admin) return res.status(404).json({ message: "Aucun admin actif pour ce tenant." });
  const token = jwt.sign({ userId: admin._id, role: admin.role, tenantId: admin.tenantId }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, tenantId: admin.tenantId } });
};
