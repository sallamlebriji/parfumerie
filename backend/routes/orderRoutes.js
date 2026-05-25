import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { checkTenantActive, protect, requireModule, scopeTenant } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", asyncHandler(createOrder));
router.get("/", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(getOrders));
router.get("/:id", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(getOrderById));
router.put("/:id/status", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(updateOrderStatus));
router.delete("/:id", protect, checkTenantActive, scopeTenant, requireModule("orders"), asyncHandler(deleteOrder));

export default router;
