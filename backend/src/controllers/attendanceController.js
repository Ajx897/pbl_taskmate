import { Attendance } from "../models/attendanceModel.js";
import { Student } from "../models/studentModel.js";
import { Teacher } from "../models/teacherModel.js";
import { Course } from "../models/courseModel.js";

// Get attendance for a student
export const getStudentAttendance = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    const studentId = req.user._id;

    // Build query
    const query = { student: studentId };
    if (courseId) {
      query.course = courseId;
    }
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get attendance records
    const attendance = await Attendance.find(query)
      .populate("course", "name code")
      .populate("markedBy", "firstName lastName")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error getting student attendance:", error);
    res.status(500).json({
      success: false,
      message: "Error getting student attendance",
      error: error.message,
    });
  }
};

// Get attendance for all students in a course
export const getAllStudentsAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Build query
    const query = { course: courseId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get attendance records
    const attendance = await Attendance.find(query)
      .populate("student", "firstName lastName email")
      .populate("markedBy", "firstName lastName")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error getting attendance:", error);
    res.status(500).json({
      success: false,
      message: "Error getting attendance",
      error: error.message,
    });
  }
};

// Mark attendance for a student
export const markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;

    // Debug logging
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);

    // Validate required fields
    if (!studentId || !courseId || !date || !status) {
      console.log('Missing required fields:', { studentId, courseId, date, status });
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      console.log('Student not found:', studentId);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found:', courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if teacher exists and is authorized
    const teacher = await Teacher.findById(req.user._id);
    if (!teacher) {
      console.log('Teacher not found:', req.user._id);
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      course: courseId,
      date: new Date(date),
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.markedBy = teacher._id;
      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        data: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      student: studentId,
      course: courseId,
      date: new Date(date),
      status,
      markedBy: teacher._id,
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

// Update attendance (teacher)
export const updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, remarks } = req.body;
    const teacherId = req.user.userId;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Check if the teacher is authorized to update this record
    if (attendance.markedBy.toString() !== teacherId) {
      return res.status(403).json({ error: 'Not authorized to update this attendance record' });
    }

    attendance.status = status;
    attendance.remarks = remarks;
    await attendance.save();

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all courses taught by the teacher
    const courses = await Course.find({ teacher: teacherId });
    const courseIds = courses.map(course => course._id);

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      course: { $in: courseIds },
      date: today
    });

    // Calculate today's stats
    const presentCount = todayAttendance.filter(a => a.status === 'present').length;
    const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
    const totalStudents = await Student.countDocuments({ courses: { $in: courseIds } });
    const attendancePercentage = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

    // Get weekly trend (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          date: { $gte: weekAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { date: "$date", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          present: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "present"] }, "$count", 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "absent"] }, "$count", 0]
            }
          }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Get monthly trend (last 30 days)
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlyAttendance = await Attendance.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          date: { $gte: monthAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { date: "$date", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          present: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "present"] }, "$count", 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "absent"] }, "$count", 0]
            }
          }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Format dates for the frontend
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    const weeklyTrend = weeklyAttendance.map(day => ({
      date: formatDate(day._id),
      present: day.present,
      absent: day.absent
    }));

    const monthlyTrend = monthlyAttendance.map(day => ({
      date: formatDate(day._id),
      present: day.present,
      absent: day.absent
    }));

    res.json({
      totalStudents,
      presentCount,
      absentCount,
      attendancePercentage,
      weeklyTrend,
      monthlyTrend
    });
  } catch (error) {
    console.error('Error getting attendance stats:', error);
    res.status(500).json({ message: 'Error getting attendance statistics' });
  }
}; 