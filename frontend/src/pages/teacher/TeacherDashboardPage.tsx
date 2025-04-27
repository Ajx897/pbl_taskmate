import { useState, useEffect } from "react";
import { Navbar } from "@/components/teacher/TeacherNavbar";
import { AttendanceSummary } from "@/components/teacher/AttendanceSummary";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, Users, Percent, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { toast } from "react-toastify";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Course {
  _id: string;
  name: string;
  code: string;
  students: Student[];
}

interface Student {
  _id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  program: string;
  year: string;
  attendance?: {
    total: number;
    present: number;
    percentage: number;
  };
}

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

const TeacherDashboardPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  useEffect(() => {
    fetchCourses();
    fetchDashboardStats();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/teacher/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.data && typeof response.data === 'object') {
        const coursesData = response.data.courses || response.data.data || [];
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await axios.get("/api/teacher/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch all students
      const studentsResponse = await axios.get("/api/teacher/students", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Students Response:', studentsResponse.data);
      console.log('Students Count:', studentsResponse.data?.length);

      // Update stats with actual student count
      const updatedStats = {
        ...statsResponse.data,
        totalStudents: Array.isArray(studentsResponse.data) ? studentsResponse.data.length : 0
      };

      console.log('Updated Stats:', updatedStats);
      setStats(updatedStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    }
  };

  // Get all students from all courses
  const allStudents = courses.flatMap(course => 
    course.students.map(student => ({
      ...student,
      courseName: course.name,
      courseId: course._id
    }))
  );

  const filteredStudents = selectedDivision === "all" 
    ? allStudents 
    : allStudents.filter(s => s.program === selectedDivision);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate average attendance percentage
  const averageAttendance = stats?.recentAttendance?.reduce((acc, curr) => {
    return acc + (curr.status === 'present' ? 1 : 0);
  }, 0) ?? 0;
  const attendancePercentage = stats?.recentAttendance?.length 
    ? (averageAttendance / stats.recentAttendance.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      <div className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <Link to="/" className="mt-2 sm:mt-0">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Welcome
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{attendancePercentage?.toFixed(1) || "0.0"}%</div>
                    <p className="text-xs text-muted-foreground">
                      Based on recent records
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.courseStats?.length || 0} with active students
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(stats?.courseStats?.reduce((acc, curr) => acc + (curr?.averageGPA || 0), 0) / (stats?.courseStats?.length || 1) || 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all courses
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="bg-background border rounded-md px-2 py-1 text-sm"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  <option value="all">All Programs</option>
                  {Array.from(new Set(allStudents?.map(s => s?.program) || [])).map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredStudents?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No students found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredStudents?.map((student) => (
                        <div key={student?._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {student?.firstname?.charAt(0) || ""}{student?.lastname?.charAt(0) || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {student?.firstname && student?.lastname 
                                  ? `${student.firstname} ${student.lastname}` 
                                  : student?.email?.split('@')[0]}
                              </div>
                              <div className="text-sm text-muted-foreground">{student?.email}</div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student?.program} • {student?.year}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Tabs defaultValue="courses" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="courses">Course Overview</TabsTrigger>
                  <TabsTrigger value="attendance">Recent Attendance</TabsTrigger>
                </TabsList>

                <TabsContent value="courses" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats?.courseStats?.map((course) => (
                      <Card key={course?.courseId}>
                        <CardHeader>
                          <CardTitle>{course?.courseName}</CardTitle>
                          <CardDescription>{course?.courseCode}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Students</span>
                              <span className="font-medium">{course?.studentCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Average GPA</span>
                              <span className="font-medium">{(course?.averageGPA || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Attendance Records</CardTitle>
                      <CardDescription>Last 10 attendance records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats?.recentAttendance?.map((record) => (
                          <div
                            key={record?._id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {record?.student?.firstname} {record?.student?.lastname}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record?.course?.name} ({record?.course?.code})
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {new Date(record?.date).toLocaleDateString()}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  record?.status === "present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record?.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
