import { Student } from "../models/studentModel.js";
import { Teacher } from "../models/teacherModel.js";
import { Admin } from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User (Student or Teacher)
export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, program, year, department } = req.body;

    // Check if user already exists
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingStudent || existingTeacher || existingAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      // Register as Student
      const newStudent = await Student.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        program,
        year
      });

      console.log("✅ Student registered:", newStudent);
      res.status(201).json({ message: "Student registered successfully" });
    } else if (role === 'teacher') {
      // Register as Teacher
      const newTeacher = await Teacher.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        department
      });

      console.log("✅ Teacher registered:", newTeacher);
      res.status(201).json({ message: "Teacher registered successfully" });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login User (Student, Teacher, or Admin)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log("🔍 Login attempt:", { email, role });

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and role" });
    }

    let user;
    if (role === 'student') {
      user = await Student.findOne({ email });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare password using bcrypt directly
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isMatch ? "Yes" : "No");

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set in environment variables");
      console.error("Current environment variables:", {
        PORT: process.env.PORT,
        MONGO_URL: process.env.MONGO_URL ? "Set" : "Not set",
        JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set"
      });
      return res.status(500).json({ 
        message: "Server configuration error",
        details: "JWT_SECRET is not properly configured"
      });
    }

    const token = jwt.sign({ 
      userId: user._id,
      role: user.role || role
    }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Get token details
    const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      token,
      tokenDetails,
      user: {
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        role: user.role || role,
        ...(user.program && { program: user.program }),
        ...(user.year && { year: user.year }),
        ...(user.department && { department: user.department })
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};
