import { Teacher } from "../models/teacherModel.js";
import { Course } from "../models/courseModel.js";
import { Student } from "../models/studentModel.js";
import { Attendance } from "../models/attendanceModel.js";
import jwt from "jsonwebtoken";

// Teacher login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: teacher._id, role: teacher.role },
      process.env.JWT_SECRET || "@Taskmate1234",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: teacher._id,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email,
        department: teacher.department,
        role: teacher.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get teacher profile
export const getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.userId)
      .populate('courses', 'name code');
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update teacher profile
export const updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, department } = req.body;
    
    const teacher = await Teacher.findById(req.user.userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.firstname = firstname || teacher.firstname;
    teacher.lastname = lastname || teacher.lastname;
    teacher.department = department || teacher.department;

    await teacher.save();

    res.json(teacher);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { code, name, description, credits, startDate, endDate, schedule, maxStudents } = req.body;
    const teacherId = req.user.userId;

    // Validate required fields
    if (!code || !name || !credits) {
      return res.status(400).json({ 
        message: "Course code, name, and credits are required" 
      });
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ 
        message: "A course with this code already exists" 
      });
    }

    // Create new course
    const course = new Course({
      code,
      name,
      description,
      credits,
      teacher: teacherId,
      startDate: startDate || new Date(),
      endDate,
      schedule,
      maxStudents: maxStudents || 50, // Default max students
      students: []
    });

    await course.save();

    // Add course to teacher's courses array
    await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { courses: course._id } }
    );

    res.status(201).json({
      message: "Course created successfully",
      course: {
        id: course._id,
        code: course.code,
        name: course.name,
        description: course.description,
        credits: course.credits,
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule,
        maxStudents: course.maxStudents,
        studentCount: 0
      }
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ 
      message: "Error creating course",
      error: error.message 
    });
  }
};

// Get all courses for a teacher
export const getCourses = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.userId)
      .populate('courses');
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher.courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, credits } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    course.code = code || course.code;
    course.name = name || course.name;
    course.description = description || course.description;
    course.credits = credits || course.credits;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(id);
    
    // Remove course from teacher's courses array
    await Teacher.findByIdAndUpdate(
      req.user.userId,
      { $pull: { courses: id } }
    );

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all students in a teacher's courses
export const getStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.userId)
      .populate({
        path: 'courses',
        populate: {
          path: 'students',
          model: 'Student'
        }
      });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Flatten students from all courses
    const students = teacher.courses.reduce((acc, course) => {
      return [...acc, ...course.students];
    }, []);

    // Remove duplicates
    const uniqueStudents = [...new Set(students.map(s => s._id.toString()))]
      .map(id => students.find(s => s._id.toString() === id));

    res.json(uniqueStudents);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update student grade
export const updateStudentGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, grade } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update grades for this course" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update grade in student's submissions
    const submission = student.submissions.find(s => s.course.toString() === courseId);
    if (submission) {
      submission.grade = grade;
      await student.save();
    }

    res.json({ message: "Grade updated successfully" });
  } catch (error) {
    console.error("Update grade error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset teacher password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update password (the pre-save middleware will hash it)
    teacher.password = newPassword;
    await teacher.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get available students (students not in teacher's courses)
export const getAvailableStudents = async (req, res) => {
  try {
    // Get all students that are not enrolled in any courses
    const availableStudents = await Student.find({
      courses: { $size: 0 }
    }).select('firstName lastName email program year');

    res.json({
      success: true,
      data: availableStudents
    });
  } catch (error) {
    console.error('Error fetching available students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available students'
    });
  }
};

// Get dashboard statistics for a teacher
export const getDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.userId;

    // Get all courses taught by the teacher
    const courses = await Course.find({ teacher: teacherId });
    const courseIds = courses.map(course => course._id);

    // Get total students across all courses
    const totalStudents = await Student.countDocuments({ courses: { $in: courseIds } });

    // Get course-wise statistics
    const courseStats = await Promise.all(courses.map(async (course) => {
      const studentCount = await Student.countDocuments({ courses: course._id });
      const attendanceRecords = await Attendance.find({ course: course._id });
      
      // Calculate average GPA (placeholder - implement your GPA calculation logic)
      const averageGPA = 3.5; // This should be calculated based on your grading system

      return {
        courseId: course._id,
        courseName: course.name,
        courseCode: course.code,
        studentCount,
        averageGPA
      };
    }));

    // Get recent attendance records
    const recentAttendance = await Attendance.find({
      course: { $in: courseIds }
    })
    .sort({ date: -1 })
    .limit(10)
    .populate('student', 'firstname lastname')
    .populate('course', 'name code');

    res.json({
      success: true,
      data: {
        totalStudents,
        totalCourses: courses.length,
        courseStats,
        recentAttendance
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard statistics',
      error: error.message
    });
  }
};

// Get detailed student information for a specific course
export const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.userId;

    // Find the course and verify teacher ownership
    const course = await Course.findOne({
      _id: courseId,
      teacher: teacherId
    }).populate({
      path: 'students',
      select: 'firstname lastname email program year gpa studyHours',
      populate: {
        path: 'submissions',
        match: { course: courseId }
      }
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    // Get attendance records for the course
    const attendanceRecords = await Attendance.find({
      course: courseId,
      markedBy: teacherId
    }).sort({ date: -1 });

    // Calculate attendance statistics for each student
    const studentStats = course.students.map(student => {
      const studentAttendance = attendanceRecords.filter(record => 
        record.student.toString() === student._id.toString()
      );

      const totalClasses = studentAttendance.length;
      const presentClasses = studentAttendance.filter(record => 
        record.status === 'present'
      ).length;

      const attendancePercentage = totalClasses > 0
        ? (presentClasses / totalClasses) * 100
        : 0;

      return {
        ...student.toObject(),
        attendance: {
          total: totalClasses,
          present: presentClasses,
          percentage: Number(attendancePercentage.toFixed(2))
        }
      };
    });

    res.json({
      courseName: course.name,
      courseCode: course.code,
      students: studentStats
    });
  } catch (error) {
    console.error("Get course students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add students to a course
export const addStudentsToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentIds } = req.body;
    const teacherId = req.user.userId;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ 
        message: "Student IDs array is required" 
      });
    }

    // Find the course and verify teacher ownership
    const course = await Course.findOne({
      _id: courseId,
      teacher: teacherId
    });

    if (!course) {
      return res.status(404).json({ 
        message: "Course not found or unauthorized" 
      });
    }

    // Check if course is full
    if (course.students.length + studentIds.length > course.maxStudents) {
      return res.status(400).json({ 
        message: `Course is full. Maximum capacity is ${course.maxStudents} students.` 
      });
    }

    // Add students to course
    const uniqueStudentIds = [...new Set(studentIds)];
    
    // Update course with new students
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: { $each: uniqueStudentIds } } }
    );

    // Update students with the course
    await Student.updateMany(
      { _id: { $in: uniqueStudentIds } },
      { $addToSet: { courses: courseId } }
    );

    res.status(200).json({
      message: "Students added to course successfully",
      addedCount: uniqueStudentIds.length
    });
  } catch (error) {
    console.error("Add students to course error:", error);
    res.status(500).json({ 
      message: "Error adding students to course",
      error: error.message 
    });
  }
}; 