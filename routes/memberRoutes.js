import express from "express";
import {
  addMember,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
  getOverdueMembers,
  getDueSoonMembers,
  getPaidMembers,
  getDashboardStats,
  searchMembers,
} from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Search and filter
router.get("/search", searchMembers);

// Member categories
router.get("/overdue", getOverdueMembers);
router.get("/due-soon", getDueSoonMembers);
router.get("/paid", getPaidMembers);

// CRUD operations
router.post("/add", addMember);
router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
