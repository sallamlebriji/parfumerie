import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  trackOrder,
  updateOrderStatus
} from "../controllers/orderController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { checkTenantActive, protect, requireModule, scopeTenant } from "../middleware/authMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/", asyncHandler(createOrder));
router.get("/track", rateLimit({ max: 30 }), asyncHandler(trackOrder));
router.get("/", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(getOrders));
router.get("/:id", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(getOrderById));
router.put("/:id/status", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(updateOrderStatus));
router.delete("/:id", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(deleteOrder));

export default router;
