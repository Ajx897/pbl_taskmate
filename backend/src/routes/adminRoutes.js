import express from "express";
import { 
  login, 
  getTeachers, 
  addTeacher, 
  updateTeacher, 
  resetTeacherPassword, 
  deleteTeacher 
} from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);

// Protected routes (admin only)
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/teachers", getTeachers);
router.post("/teachers", addTeacher);
router.put("/teachers/:id", updateTeacher);
router.put("/teachers/:id/reset-password", resetTeacherPassword);
router.delete("/teachers/:id", deleteTeacher);

export default router; 