import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => res.json({ message: "Perfume Shop API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/perfumes", perfumeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tenants", tenantRoutes);

app.use((err, _req, res, _next) => {
  const status = err.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: err.message || "Erreur serveur." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
