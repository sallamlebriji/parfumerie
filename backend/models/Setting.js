import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
    shopName: { type: String, default: "Maison Parfumee" },
    currency: { type: String, default: "MAD" },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    taxRate: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    whatsappNumber: { type: String, default: "" },
    orderNotificationNumber: { type: String, default: "" },
    allowOnlineOrders: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    invoicePrefix: { type: String, default: "CMD" },
    address: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

settingSchema.statics.getGlobal = async function getGlobal() {
  const existing = await this.findOne({ key: "global" });
  if (existing) return existing;

  return this.create({
    key: "global",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    orderNotificationNumber: process.env.WHATSAPP_ORDER_TO_NUMBER || ""
  });
};

settingSchema.statics.getForTenant = async function getForTenant(tenantId) {
  if (!tenantId) return this.getGlobal();
  const key = `tenant:${tenantId}`;
  const existing = await this.findOne({ key, tenantId });
  if (existing) return existing;

  return this.create({
    key,
    tenantId,
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    orderNotificationNumber: process.env.WHATSAPP_ORDER_TO_NUMBER || ""
  });
};

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
