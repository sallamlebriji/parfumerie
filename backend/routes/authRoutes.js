import express from "express";
import { login, profile } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", asyncHandler(login));
router.get("/profile", protect, asyncHandler(profile));

export default router;
