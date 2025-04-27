import { Admin } from "../models/adminModel.js";
import { Teacher } from "../models/teacherModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        name: `${admin.firstname} ${admin.lastname}`,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new teacher
export const addTeacher = async (req, res) => {
  try {
    const { firstname, lastname, email, password, department } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Create new teacher
    const teacher = await Teacher.create({
      firstname,
      lastname,
      email,
      password,
      department
    });

    res.status(201).json({
      message: "Teacher added successfully",
      teacher: {
        id: teacher._id,
        name: `${teacher.firstname} ${teacher.lastname}`,
        email: teacher.email,
        department: teacher.department
      }
    });
  } catch (error) {
    console.error("Add teacher error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, department } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.firstname = firstname || teacher.firstname;
    teacher.lastname = lastname || teacher.lastname;
    teacher.email = email || teacher.email;
    teacher.department = department || teacher.department;

    await teacher.save();

    res.json({
      message: "Teacher updated successfully",
      teacher: {
        id: teacher._id,
        name: `${teacher.firstname} ${teacher.lastname}`,
        email: teacher.email,
        department: teacher.department
      }
    });
  } catch (error) {
    console.error("Update teacher error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset teacher password
export const resetTeacherPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.password = newPassword;
    await teacher.save();

    res.json({ message: "Teacher password reset successfully" });
  } catch (error) {
    console.error("Reset teacher password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.remove();
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete teacher error:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 