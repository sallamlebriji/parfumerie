import express from "express";
import {
  createPerfume,
  deletePerfume,
  getFeaturedPerfumes,
  getPerfumeById,
  getPerfumes,
  updatePerfume
} from "../controllers/perfumeController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { checkTenantActive, optionalProtect, protect, requireModule, scopeTenant } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, asyncHandler(getPerfumes));
router.get("/featured/list", optionalProtect, asyncHandler(getFeaturedPerfumes));
router.get("/:id", optionalProtect, asyncHandler(getPerfumeById));
router.post("/", protect, checkTenantActive, scopeTenant, requireModule("products"), upload.single("image"), asyncHandler(createPerfume));
router.put("/:id", protect, checkTenantActive, scopeTenant, requireModule("products"), upload.single("image"), asyncHandler(updatePerfume));
router.delete("/:id", protect, checkTenantActive, scopeTenant, requireModule("products"), asyncHandler(deletePerfume));

export default router;
