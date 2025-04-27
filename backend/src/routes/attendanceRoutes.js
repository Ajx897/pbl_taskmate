import express from "express";
import { authMiddleware, teacherMiddleware } from "../middleware/authMiddleware.js";
import {
  markAttendance,
  getAllStudentsAttendance,
  getStudentAttendance,
  getAttendanceStats,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Teacher routes - require teacher role
router.post("/mark", teacherMiddleware, markAttendance);
router.get("/course/:courseId", teacherMiddleware, getAllStudentsAttendance);
router.get("/stats", teacherMiddleware, getAttendanceStats);

// Student routes
router.get("/student/:studentId", getStudentAttendance);

export default router; 