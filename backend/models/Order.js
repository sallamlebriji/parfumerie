import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  products: [
    {
      perfumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Perfume", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1 },
      volume: { type: String, required: true },
      image: { type: String, default: "" }
    }
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "delivered"],
    default: "pending"
  },
  notes: { type: String, default: "" },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
  parfumerie: { type: mongoose.Schema.Types.ObjectId, ref: "Parfumerie" },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre("save", function syncTenant(next) {
  if (!this.tenantId && this.parfumerie) this.tenantId = this.parfumerie;
  if (!this.parfumerie && this.tenantId) this.parfumerie = this.tenantId;
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
