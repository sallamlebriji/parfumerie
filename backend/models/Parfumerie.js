import mongoose from "mongoose";

const parfumerieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    city: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    logo: { type: String, default: "" },
    primaryColor: { type: String, default: "#D8B87E", trim: true },
    phone: { type: String, default: "", trim: true },
    whatsappNumber: { type: String, default: "", trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    managerName: { type: String, default: "", trim: true },
    modules: { type: [String], default: undefined },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

parfumerieSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

const Parfumerie = mongoose.model("Parfumerie", parfumerieSchema);
export default Parfumerie;
