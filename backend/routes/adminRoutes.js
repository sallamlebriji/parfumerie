import express from "express";
import {
  getAdminProducts,
  getBrands,
  getCategories,
  getCustomers,
  getDashboard,
  getOrdersForAdmin,
  getParfumeries,
  getPromotions,
  getSettings,
  getStocks,
  getUsers,
  createUser,
  deleteUser,
  createParfumerie,
  deleteParfumerie,
  toggleUser,
  updateParfumerie,
  updateUser,
  updateSettings
} from "../controllers/adminController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { allowRoles, checkTenantActive, protect, requireModule, scopeTenant } from "../middleware/authMiddleware.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

router.use(protect, checkTenantActive, scopeTenant);

router.get("/dashboard", requireModule("dashboard"), asyncHandler(getDashboard));
router.get("/products", requireModule("products"), asyncHandler(getAdminProducts));
router.get("/orders", requireModule("orders"), asyncHandler(getOrdersForAdmin));
router.get("/customers", requireModule("customers"), asyncHandler(getCustomers));
router.get("/stocks", requireModule("stocks"), asyncHandler(getStocks));
router.get("/categories", requireModule("products"), asyncHandler(getCategories));
router.get("/brands", requireModule("products"), asyncHandler(getBrands));
router.get("/promotions", requireModule("promotions"), asyncHandler(getPromotions));
router.get("/parfumeries", allowRoles(ROLES.SUPER_ADMIN), asyncHandler(getParfumeries));
router.post("/parfumeries", allowRoles(ROLES.SUPER_ADMIN), asyncHandler(createParfumerie));
router.put("/parfumeries/:id", allowRoles(ROLES.SUPER_ADMIN), asyncHandler(updateParfumerie));
router.delete("/parfumeries/:id", allowRoles(ROLES.SUPER_ADMIN), asyncHandler(deleteParfumerie));
router.get("/settings", requireModule("settings"), asyncHandler(getSettings));
router.put("/settings", requireModule("settings"), asyncHandler(updateSettings));
router.get("/users", requireModule("users"), asyncHandler(getUsers));
router.post("/users", requireModule("users"), asyncHandler(createUser));
router.put("/users/:id", requireModule("users"), asyncHandler(updateUser));
router.patch("/users/:id/toggle", requireModule("users"), asyncHandler(toggleUser));
router.delete("/users/:id", requireModule("users"), asyncHandler(deleteUser));

export default router;
