import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, Clock, BookOpen, Percent } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  courseStats: Array<{
    courseId: string;
    courseName: string;
    courseCode: string;
    studentCount: number;
    averageGPA: number;
  }>;
  recentAttendance: Array<{
    _id: string;
    student: {
      firstname: string;
      lastname: string;
    };
    course: {
      name: string;
      code: string;
    };
    status: string;
    date: string;
  }>;
}

export function TeacherDashboardStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/teacher/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate average attendance percentage
  const averageAttendance = stats?.recentAttendance.reduce((acc, curr) => {
    return acc + (curr.status === 'present' ? 1 : 0);
  }, 0) || 0;
  const attendancePercentage = stats?.recentAttendance.length 
    ? (averageAttendance / stats.recentAttendance.length) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
          <p className="text-xs text-muted-foreground">
            Across {stats?.totalCourses || 0} courses
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Based on recent records
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.courseStats.length || 0} with active students
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stats?.courseStats.reduce((acc, curr) => acc + curr.averageGPA, 0) / (stats?.courseStats.length || 1)).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all courses
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
