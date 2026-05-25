import express from "express";
import { createSale, deleteSale, getSaleById, getSales } from "../controllers/saleController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { checkTenantActive, protect, requireModule, scopeTenant } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, checkTenantActive, scopeTenant, requireModule("sales"), asyncHandler(createSale));
router.get("/", protect, checkTenantActive, scopeTenant, requireModule("sales"), asyncHandler(getSales));
router.get("/:id", protect, checkTenantActive, scopeTenant, requireModule("sales"), asyncHandler(getSaleById));
router.delete("/:id", protect, checkTenantActive, scopeTenant, requireModule("sales"), asyncHandler(deleteSale));

export default router;
