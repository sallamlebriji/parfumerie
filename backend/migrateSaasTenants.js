import dotenv from "dotenv";
import { DEFAULT_ENABLED_MODULES, normalizeRole } from "./config/roles.js";
import connectDB from "./config/db.js";
import Order from "./models/Order.js";
import Parfumerie from "./models/Parfumerie.js";
import Perfume from "./models/Perfume.js";
import Sale from "./models/Sale.js";
import Setting from "./models/Setting.js";
import Subscription from "./models/Subscription.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

const getDefaultTenant = async () => {
  let tenant = await Parfumerie.findOne({ slug: "maison-parfumee" });
  if (!tenant) {
    tenant = await Parfumerie.create({
      name: process.env.DEFAULT_TENANT_NAME || "Maison Parfumee",
      slug: "maison-parfumee",
      email: process.env.DEFAULT_TENANT_EMAIL || process.env.ADMIN_EMAIL || "",
      phone: process.env.WHATSAPP_NUMBER || "",
      address: "",
      primaryColor: "#D8B87E",
      modules: DEFAULT_ENABLED_MODULES,
      isActive: true
    });
    console.log(`Default tenant created: ${tenant.name} (${tenant.slug})`);
  }
  return tenant;
};

const hasLegacyBusinessData = await Promise.all([
  Perfume.exists({ tenantId: null, parfumerie: null }),
  Order.exists({ tenantId: null, parfumerie: null }),
  Sale.exists({ tenantId: null, parfumerie: null })
]).then((checks) => checks.some(Boolean));

const defaultTenant = hasLegacyBusinessData ? await getDefaultTenant() : null;
const collections = [User, Perfume, Order, Sale];

for (const Model of collections) {
  const docs = await Model.find({ tenantId: { $exists: false }, parfumerie: { $exists: true, $ne: null } });
  for (const doc of docs) {
    doc.tenantId = doc.parfumerie;
    await doc.save();
  }
  console.log(`${Model.modelName}: ${docs.length} document(s) synchronise(s).`);

  if (defaultTenant && Model.modelName !== "User") {
    const result = await Model.updateMany(
      { tenantId: null, parfumerie: null },
      { $set: { tenantId: defaultTenant._id, parfumerie: defaultTenant._id } }
    );
    console.log(`${Model.modelName}: ${result.modifiedCount} document(s) rattache(s) au tenant par defaut.`);
  }
}

const users = await User.find();
for (const user of users) {
  user.role = normalizeRole(user.role);
  if (!user.tenantId && user.parfumerie) user.tenantId = user.parfumerie;
  await user.save();
}
console.log(`Users roles synchronises: ${users.length}`);

const tenants = await Parfumerie.find();
for (const tenant of tenants) {
  if (!tenant.primaryColor) tenant.primaryColor = "#D8B87E";
  if (!tenant.modules?.length) tenant.modules = DEFAULT_ENABLED_MODULES;
  if (!tenant.modules.includes("users")) tenant.modules = [...tenant.modules, "users"];
  await tenant.save();

  await Subscription.findOneAndUpdate(
    { tenantId: tenant._id },
    {
      $setOnInsert: { tenantId: tenant._id, plan: "FREE", status: "trial" },
      $addToSet: { enabledModules: { $each: tenant.modules || DEFAULT_ENABLED_MODULES } }
    },
    { upsert: true, new: true }
  );

  await Setting.findOneAndUpdate(
    { key: `tenant:${tenant._id}` },
    { $setOnInsert: { key: `tenant:${tenant._id}`, tenantId: tenant._id, shopName: tenant.name } },
    { upsert: true, new: true }
  );
}
console.log(`Tenants verifies: ${tenants.length}`);

process.exit(0);
