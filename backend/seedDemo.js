import dotenv from "dotenv";
import { DEFAULT_ENABLED_MODULES, ROLES } from "./config/roles.js";
import connectDB from "./config/db.js";
import Parfumerie from "./models/Parfumerie.js";
import Perfume from "./models/Perfume.js";
import Subscription from "./models/Subscription.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

const DEMO_PASSWORD = "Demo12345";

const DEMO_ACCOUNTS = [
  { name: "Demo Administrateur", email: "demo.admin@parfumerie.local", role: ROLES.ADMIN_TENANT },
  { name: "Demo Manager", email: "demo.manager@parfumerie.local", role: ROLES.MANAGER },
  { name: "Demo Employe", email: "demo.employe@parfumerie.local", role: ROLES.EMPLOYEE }
];

const tenant = await Parfumerie.findOneAndUpdate(
  { slug: "demo-parfumerie" },
  {
    $set: { name: "Parfumerie Demo", city: "Casablanca", primaryColor: "#D8B87E", modules: DEFAULT_ENABLED_MODULES, isActive: true },
    $setOnInsert: { slug: "demo-parfumerie" }
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

await Subscription.findOneAndUpdate(
  { tenantId: tenant._id },
  { $set: { plan: "PRO", status: "active", maxUsers: 10, maxItems: 500, enabledModules: DEFAULT_ENABLED_MODULES } },
  { upsert: true, setDefaultsOnInsert: true }
);

for (const account of DEMO_ACCOUNTS) {
  const user = (await User.findOne({ email: account.email })) || new User({ email: account.email });
  Object.assign(user, { ...account, password: DEMO_PASSWORD, tenantId: tenant._id, parfumerie: tenant._id, isActive: true });
  await user.save();
  console.log(`Demo account ready: ${account.email} (${account.role})`);
}

if (!(await Perfume.exists({ tenantId: tenant._id }))) {
  const source = await Perfume.find({ tenantId: { $ne: tenant._id } }).sort({ createdAt: -1 }).limit(12).lean();
  const copies = source.map(({ _id, __v, ...perfume }) => ({ ...perfume, tenantId: tenant._id, parfumerie: tenant._id }));
  if (copies.length) await Perfume.insertMany(copies);
  console.log(`${copies.length} demo perfume(s) copied into the demo tenant.`);
}

console.log(`Demo tenant: ${tenant.name} - password for all demo accounts: ${DEMO_PASSWORD}`);
process.exit(0);
