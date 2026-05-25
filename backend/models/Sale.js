import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  perfumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Perfume", required: true },
  perfumeName: { type: String, required: true },
  brand: { type: String, default: "" },
  volume: { type: String, default: "" },
  image: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 1 },
  stockBefore: { type: Number, default: 0, min: 0 },
  stockAfter: { type: Number, default: 0, min: 0 },
  purchasePrice: { type: Number, default: 0, min: 0 },
  salePrice: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  totalCost: { type: Number, default: 0, min: 0 },
  profit: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["cash", "card", "transfer", "other"], default: "cash" },
  customerName: { type: String, default: "" },
  notes: { type: String, default: "" },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
  parfumerie: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
  createdAt: { type: Date, default: Date.now }
});

saleSchema.pre("save", function syncTenant(next) {
  if (!this.tenantId && this.parfumerie) this.tenantId = this.parfumerie;
  if (!this.parfumerie && this.tenantId) this.parfumerie = this.tenantId;
  next();
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
