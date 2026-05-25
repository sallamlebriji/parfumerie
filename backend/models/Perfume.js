import mongoose from "mongoose";

const perfumeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  purchasePrice: { type: Number, default: 0, min: 0 },
  quantityPurchased: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: 0, min: 0 },
  volume: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  gender: { type: String, enum: ["Homme", "Femme", "Mixte"], default: "Mixte" },
  stock: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  image: { type: String, default: "" },
  notes: {
    top: { type: String, default: "" },
    middle: { type: String, default: "" },
    base: { type: String, default: "" }
  },
  isFeatured: { type: Boolean, default: false },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
  parfumerie: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
  createdAt: { type: Date, default: Date.now }
});

perfumeSchema.pre("save", function syncTenant(next) {
  if (!this.tenantId && this.parfumerie) this.tenantId = this.parfumerie;
  if (!this.parfumerie && this.tenantId) this.parfumerie = this.tenantId;
  next();
});

const Perfume = mongoose.model("Perfume", perfumeSchema);
export default Perfume;
