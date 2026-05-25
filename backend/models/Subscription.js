import mongoose from "mongoose";
import { DEFAULT_ENABLED_MODULES } from "../config/roles.js";

const subscriptionSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie", required: true, unique: true },
    plan: { type: String, enum: ["FREE", "STARTER", "PRO", "ENTERPRISE"], default: "FREE" },
    status: { type: String, enum: ["trial", "active", "past_due", "canceled"], default: "trial" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    maxUsers: { type: Number, default: 3, min: 1 },
    maxStorage: { type: Number, default: 512, min: 0 },
    maxItems: { type: Number, default: 100, min: 0 },
    enabledModules: { type: [String], default: DEFAULT_ENABLED_MODULES }
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
