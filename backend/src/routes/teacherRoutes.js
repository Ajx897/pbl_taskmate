import express from "express";
import { 
  login, 
  getProfile, 
  updateProfile, 
  createCourse, 
  getCourses, 
  updateCourse, 
  deleteCourse, 
  getStudents, 
  updateStudentGrade, 
  resetPassword, 
  getAvailableStudents,
  getDashboardStats,
  getCourseStudents,
  addStudentsToCourse
} from "../controllers/teacherController.js";
import { authMiddleware, teacherMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);

// Protected routes - require authentication
router.use(authMiddleware);
router.use(teacherMiddleware);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/reset-password", resetPassword);

// Course routes
router.post("/courses", createCourse);
router.get("/courses", getCourses);
router.get("/courses/:courseId/students", getCourseStudents);
router.post("/courses/:courseId/students", addStudentsToCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Student routes
router.get("/students", getStudents);
router.put("/students/:id/grade", updateStudentGrade);

// Get available students (not enrolled in teacher's courses)
router.get('/available-students', getAvailableStudents);

// Dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

export default router; 