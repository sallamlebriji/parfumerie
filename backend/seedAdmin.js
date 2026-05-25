import dotenv from "dotenv";
import { ROLES } from "./config/roles.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

const email = process.env.ADMIN_EMAIL || "admin@parfumerie.local";
const password = process.env.ADMIN_PASSWORD || "Admin12345";

const existing = await User.findOne({ email });
if (existing) {
  existing.role = ROLES.SUPER_ADMIN;
  existing.isActive = true;
  existing.password = password;
  await existing.save();
  console.log(`Superadmin already exists and was updated: ${email} / ${password}`);
  process.exit(0);
}

await User.create({ name: "Super Administrateur", email, password, role: ROLES.SUPER_ADMIN });
console.log(`Superadmin created: ${email} / ${password}`);
process.exit(0);
