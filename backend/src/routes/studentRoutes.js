import express from "express";
import { 
  updateProfileData, 
  addCourse, 
  updateStudyHours,
  getUserProfile 
} from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - require authentication
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile-data", authMiddleware, updateProfileData);
router.post("/courses", authMiddleware, addCourse);
router.put("/study-hours", authMiddleware, updateStudyHours);

export default router; 