import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

interface CourseAttendance {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}

export function CourseAttendanceBreakdown() {
  const { token } = useAuth();
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAttendance = async () => {
      try {
        const response = await axios.get("/api/teacher/course-attendance", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseAttendance(response.data);
      } catch (error) {
        console.error("Error fetching course attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAttendance();
  }, [token]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course-wise Attendance</CardTitle>
        <CardDescription>Attendance breakdown for each course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courseAttendance.map((course) => (
            <div key={course.courseId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{course.courseName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.courseCode} • {course.totalStudents} students
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{course.attendancePercentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">
                    {course.presentCount} present • {course.absentCount} absent
                  </p>
                </div>
              </div>
              <Progress value={course.attendancePercentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 