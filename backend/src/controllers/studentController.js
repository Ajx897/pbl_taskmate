import { Student } from "../models/studentModel.js";
import { Course } from "../models/courseModel.js";

// Get student profile
export const getUserProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId)
      .select('-password')
      .populate({
        path: 'courses',
        select: 'name code credits',
        transform: (doc) => {
          // Ensure students array exists to prevent virtual property errors
          if (!doc.students) {
            doc.students = [];
          }
          return doc;
        }
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Convert to plain object and ensure all required fields exist
    const studentData = {
      ...student.toObject(),
      name: `${student.firstname} ${student.lastname}`,
      courses: student.courses || [],
      assignments: student.assignments || [],
      submissions: student.submissions || [],
      studyHours: student.studyHours || 0,
      gpa: student.gpa || 0,
      program: student.program || '',
      year: student.year || '',
      firstname: student.firstname || '',
      lastname: student.lastname || '',
      email: student.email || ''
    };

    res.status(200).json(studentData);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add new course to student's profile
export const addCourse = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update student's courses
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { courses: courseId } },
      { new: true }
    ).populate({
      path: 'courses',
      select: 'name code credits'
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Add student to course's students list
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: student._id } }
    );

    res.status(200).json({
      message: "Course added successfully",
      courses: student.courses
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update study hours
export const updateStudyHours = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { hours } = req.body;

    if (hours === undefined || hours < 0) {
      return res.status(400).json({ message: "Valid study hours required" });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { studyHours: hours } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Study hours updated successfully",
      studyHours: student.studyHours
    });
  } catch (error) {
    console.error("Error updating study hours:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update student profile data
export const updateProfileData = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { gpa, program, year } = req.body;

    // Validate input
    if (gpa !== undefined && (gpa < 0 || gpa > 4)) {
      return res.status(400).json({ message: "GPA must be between 0 and 4" });
    }

    const updateData = {};
    if (gpa !== undefined) updateData.gpa = gpa;
    if (program !== undefined) updateData.program = program;
    if (year !== undefined) updateData.year = year;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile data updated successfully",
      data: {
        gpa: student.gpa,
        program: student.program,
        year: student.year
      }
    });
  } catch (error) {
    console.error("Error updating student profile data:", error);
    res.status(500).json({ error: error.message });
  }
}; 