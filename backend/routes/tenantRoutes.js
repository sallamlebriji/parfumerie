import express from "express";
import { ROLES } from "../config/roles.js";
import {
  deleteTenant,
  getTenant,
  impersonateTenant,
  listTenants,
  provisionTenant,
  tenantStats,
  toggleTenant,
  updateTenant
} from "../controllers/tenantController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, allowRoles(ROLES.SUPER_ADMIN));

router.get("/", asyncHandler(listTenants));
router.get("/:id", asyncHandler(getTenant));
router.post("/provision", asyncHandler(provisionTenant));
router.put("/:id", asyncHandler(updateTenant));
router.patch("/:id/toggle", asyncHandler(toggleTenant));
router.delete("/:id", asyncHandler(deleteTenant));
router.get("/:id/stats", asyncHandler(tenantStats));
router.post("/:id/impersonate", asyncHandler(impersonateTenant));

export default router;
