import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { normalizeRole, ROLES } from "../config/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Administrateur" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.MANAGER, set: normalizeRole },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
    parfumerie: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  this.role = normalizeRole(this.role);
  if (!this.tenantId && this.parfumerie) this.tenantId = this.parfumerie;
  if (!this.parfumerie && this.tenantId) this.parfumerie = this.tenantId;
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
