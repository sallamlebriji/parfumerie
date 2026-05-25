import Perfume from "../models/Perfume.js";
import Parfumerie from "../models/Parfumerie.js";
import Subscription from "../models/Subscription.js";

const parseBool = (value) => value === true || value === "true";

const scopedQuery = (req) => {
  if (req.user?.role === "SUPER_ADMIN" || !req.tenantId) return {};
  return { tenantId: req.tenantId };
};

const resolveParfumerie = (req) => {
  if (req.user?.role === "SUPER_ADMIN") return req.body.tenantId || req.body.parfumerie || undefined;
  return req.tenantId || undefined;
};

const resolvePublicTenantId = async (req) => {
  const tenantId = req.query.tenantId || req.headers["x-tenant-id"];
  if (tenantId) return tenantId;

  const slug = req.query.tenantSlug || req.headers["x-tenant-slug"];
  if (slug) {
    const tenant = await Parfumerie.findOne({ slug, isActive: true }).select("_id");
    return tenant?._id;
  }

  if (req.hostname && !["localhost", "127.0.0.1"].includes(req.hostname)) {
    const subdomain = req.hostname.split(".")[0];
    const tenant = await Parfumerie.findOne({ slug: subdomain, isActive: true }).select("_id");
    return tenant?._id;
  }

  return null;
};

const publicScopedQuery = async (req) => {
  if (req.user?.role === "SUPER_ADMIN") {
    const tenantId = req.query.tenantId || req.query.parfumerie;
    return tenantId ? { tenantId } : {};
  }
  if (req.user && req.tenantId) return { tenantId: req.tenantId };

  const tenantId = await resolvePublicTenantId(req);
  if (tenantId) return { tenantId };

  const tenantCount = await Parfumerie.estimatedDocumentCount();
  if (!tenantCount) return {};

  return { tenantId: null, parfumerie: null };
};

const perfumePayload = (body, file, tenantId) => {
  const quantityPurchased = Number(body.quantityPurchased || 0);
  const stock = body.stock !== undefined && body.stock !== "" ? Number(body.stock) : quantityPurchased;

  return {
    name: body.name,
    brand: body.brand,
    description: body.description,
    purchasePrice: Number(body.purchasePrice || 0),
    quantityPurchased: quantityPurchased || stock,
    price: Number(body.price),
    oldPrice: Number(body.oldPrice || 0),
    volume: body.volume,
    category: body.category,
    gender: body.gender || "Mixte",
    stock,
    isAvailable: body.isAvailable === undefined ? stock > 0 : parseBool(body.isAvailable),
    image: file ? `/uploads/${file.filename}` : body.image || "",
    notes: {
      top: body["notes.top"] || body.top || body.notes?.top || "",
      middle: body["notes.middle"] || body.middle || body.notes?.middle || "",
      base: body["notes.base"] || body.base || body.notes?.base || ""
    },
    isFeatured: parseBool(body.isFeatured),
    ...(tenantId ? { tenantId, parfumerie: tenantId } : {})
  };
};

export const getPerfumes = async (req, res) => {
  const { search, category, brand, gender, minPrice, maxPrice } = req.query;
  const query = await publicScopedQuery(req);

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (gender) query.gender = gender;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const perfumes = await Perfume.find(query).sort({ createdAt: -1 });
  res.json(perfumes);
};

export const getFeaturedPerfumes = async (req, res) => {
  const perfumes = await Perfume.find({ ...(await publicScopedQuery(req)), isFeatured: true }).sort({ createdAt: -1 }).limit(8);
  res.json(perfumes);
};

export const getPerfumeById = async (req, res) => {
  const perfume = await Perfume.findOne({ _id: req.params.id, ...(await publicScopedQuery(req)) });
  if (!perfume) return res.status(404).json({ message: "Parfum introuvable." });
  res.json(perfume);
};

export const createPerfume = async (req, res) => {
  const required = ["name", "brand", "description", "price", "volume", "category"];
  const missing = required.filter((field) => !req.body[field]);
  if (missing.length) return res.status(400).json({ message: `Champs requis: ${missing.join(", ")}` });

  const tenantId = resolveParfumerie(req);
  if (tenantId) {
    const subscription = await Subscription.findOne({ tenantId });
    if (subscription?.maxItems) {
      const count = await Perfume.countDocuments({ tenantId });
      if (count >= subscription.maxItems) return res.status(403).json({ message: "Limite de produits atteinte pour ce plan." });
    }
  }

  const perfume = await Perfume.create(perfumePayload(req.body, req.file, tenantId));
  res.status(201).json(perfume);
};

export const updatePerfume = async (req, res) => {
  const perfume = await Perfume.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!perfume) return res.status(404).json({ message: "Parfum introuvable." });

  const payload = perfumePayload(req.body, req.file, resolveParfumerie(req));
  const restockQuantity = Number(req.body.restockQuantity || 0);
  if (restockQuantity > 0) {
    payload.stock = Number(perfume.stock || 0) + restockQuantity;
    payload.quantityPurchased = Number(perfume.quantityPurchased || 0) + restockQuantity;
    payload.isAvailable = true;
  }
  if (!req.file && !req.body.image) delete payload.image;

  const updated = await Perfume.findOneAndUpdate({ _id: req.params.id, ...scopedQuery(req) }, payload, { new: true, runValidators: true });
  res.json(updated);
};

export const deletePerfume = async (req, res) => {
  const perfume = await Perfume.findOne({ _id: req.params.id, ...scopedQuery(req) });
  if (!perfume) return res.status(404).json({ message: "Parfum introuvable." });
  await perfume.deleteOne();
  res.json({ message: "Parfum supprime." });
};
