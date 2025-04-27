import jwt from "jsonwebtoken";
import { Student } from "../models/studentModel.js";
import { Teacher } from "../models/teacherModel.js";
import { Admin } from "../models/adminModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user based on role
    let user;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.userId);
    } else if (decoded.role === 'teacher') {
      user = await Teacher.findById(decoded.userId);
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set the user object with the correct ID
    req.user = {
      _id: user._id,
      userId: user._id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

export const teacherMiddleware = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: "Access denied. Teacher only." });
  }
  next();
};

export const studentMiddleware = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};
