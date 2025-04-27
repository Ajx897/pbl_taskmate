import { useState, useEffect } from "react";
import { Navbar } from "@/components/teacher/TeacherNavbar";
import { AttendanceTable } from "@/components/teacher/AttendanceTable";
import { AttendanceFilters } from "@/components/teacher/AttendanceFilters";
import { AttendanceActions } from "@/components/teacher/AttendanceActions";
import { AttendanceModal } from "@/components/teacher/AttendanceModal";
import { StudentExcelUpload } from "@/components/teacher/StudentExcelUpload";
import { StudentBatchFilter } from "@/components/teacher/StudentBatchFilter";
import { StudentDataTable } from "@/components/teacher/StudentDataTable";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Upload, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Define API URL constant
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface Student {
  id: string;
  _id?: string;
  rollNumber?: string;
  name: string;
  firstname?: string;
  lastname?: string;
  email: string;
  batch?: string;
  program?: string;
  year?: string;
  attendance?: "present" | "absent" | null;
}

interface AttendanceStats {
  today: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
  weeklyTrend: Array<{
    date: string;
    present: number;
    absent: number;
    total: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    date: string;
    present: number;
    absent: number;
    total: number;
    percentage: number;
  }>;
}

const TeacherAttendancePage = () => {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [uploadedStudents, setUploadedStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<string>("attendance");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [courses, setCourses] = useState<Array<{ _id: string; name: string; code: string }>>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch students from the API
  useEffect(() => {
    if (!token) return;
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Debug: Check token and user role
      const storedToken = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log("Debug - Auth Info:", {
        tokenExists: !!token,
        storedTokenExists: !!storedToken,
        userRole: storedUser?.role,
        tokensMatch: token === storedToken
      });
      
      if (!token || !storedToken) {
        toast({
          title: "Authentication Error",
          description: "You are not logged in. Please log in again.",
          variant: "destructive",
        });
        // Redirect to login page
        window.location.href = '/sign-in';
        return;
      }

      if (storedUser?.role !== 'teacher') {
        toast({
          title: "Authorization Error",
          description: "You must be logged in as a teacher to access this page.",
          variant: "destructive",
        });
        // Redirect to login page
        window.location.href = '/sign-in';
        return;
      }
      
      // First, get the teacher's courses
      console.log("Fetching courses with token:", token.substring(0, 20) + "...");
      const coursesResponse = await axios.get("http://localhost:5000/api/teacher/courses", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Courses response:", coursesResponse.data);
      
      if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
        setCourses(coursesResponse.data);
        
        // If no course is selected and we have courses, select the first one
        if (!selectedCourseId && coursesResponse.data.length > 0) {
          setSelectedCourseId(coursesResponse.data[0]._id);
        }

        // Fetch all students from all courses
        console.log("Fetching all students");
        const studentsResponse = await axios.get(
          "http://localhost:5000/api/teacher/students",
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Students response:", studentsResponse.data);
        
        // Check if we have students data in the response
        const studentsData = studentsResponse.data?.data || studentsResponse.data || [];
        console.log("Students data:", studentsData);
        
        if (Array.isArray(studentsData)) {
          // Transform the API response to match our Student interface
          const formattedStudents = studentsData.map((student: any) => ({
            id: student._id,
            _id: student._id,
            name: student.firstname && student.lastname 
              ? `${student.firstname} ${student.lastname}` 
              : student.name || student.email.split('@')[0],
            firstname: student.firstname,
            lastname: student.lastname,
            email: student.email,
            program: student.program,
            year: student.year,
            attendance: null
          }));
          
          console.log("Formatted students:", formattedStudents);
          
          setStudents(formattedStudents);
          setUploadedStudents(formattedStudents);
        } else {
          console.error("Invalid students data format:", studentsData);
          toast({
            title: "Error",
            description: "Invalid student data format received from server",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
        
        // Handle authentication errors
        if (error.response?.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          // Redirect to login page
          window.location.href = '/sign-in';
        } else if (error.response?.status === 403) {
          toast({
            title: "Authorization Error",
            description: error.response?.data?.message || "You do not have permission to access this resource.",
            variant: "destructive",
          });
          // Redirect to login page
          window.location.href = '/sign-in';
        } else {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to fetch students. Please try again later.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportAttendance = () => {
    toast({
      title: "Attendance Exported",
      description: "The attendance data has been exported as CSV",
    });
  };

  const handleStartAttendance = () => {
    if (selectedSubject === "All") {
      toast({
        title: "Subject Required",
        description: "Please select a specific subject before starting attendance",
        variant: "destructive",
      });
      return;
    }
    
    if (students.length === 0) {
      toast({
        title: "No Students",
        description: "You need to add students before taking attendance",
        variant: "destructive",
      });
      return;
    }
    
    // Reset attendance for all students
    setStudents(prev => 
      prev.map(student => ({ 
        ...student, 
        attendance: null
      }))
    );
    
    setAttendanceModalOpen(true);
  };

  const handleSubmitModalAttendance = (markedStudents: Student[]) => {
    setStudents(prev => {
      // Ensure markedStudents have all required properties
      return markedStudents.map(student => ({
        ...student,
        email: student.email || `${student.name.toLowerCase().replace(' ', '.')}@example.com`,
        batch: student.batch || "A",
        attendance: student.attendance || null
      }));
    });
    
    toast({
      title: "Attendance Submitted",
      description: `Attendance for ${markedStudents.length} students has been saved successfully`,
    });
  };

  const handleUploadSuccess = (newStudents: Student[]) => {
    setUploadedStudents(newStudents);
    setSelectedBatch("all");
    toast({
      title: "Students Imported",
      description: `${newStudents.length} students have been imported successfully`,
    });
  };

  const handleAttendanceChange = (studentId: string, attendance: "present" | "absent") => {
    setUploadedStudents(prev => 
      prev.map(student => 
        student.id === studentId
          ? { ...student, attendance }
          : student
      )
    );
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(`${API_URL}/api/attendance/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        // Transform the backend response to match the AttendanceStats interface
        const backendData = response.data;
        
        // Create the expected structure
        const transformedStats: AttendanceStats = {
          today: {
            present: backendData.presentCount || 0,
            absent: backendData.absentCount || 0,
            total: (backendData.presentCount || 0) + (backendData.absentCount || 0),
            percentage: backendData.attendancePercentage || 0
          },
          weeklyTrend: backendData.weeklyTrend?.map((day: any) => ({
            date: day.date,
            present: day.present || 0,
            absent: day.absent || 0,
            total: (day.present || 0) + (day.absent || 0),
            percentage: day.total > 0 ? ((day.present || 0) / day.total) * 100 : 0
          })) || [],
          monthlyTrend: backendData.monthlyTrend?.map((day: any) => ({
            date: day.date,
            present: day.present || 0,
            absent: day.absent || 0,
            total: (day.present || 0) + (day.absent || 0),
            percentage: day.total > 0 ? ((day.present || 0) / day.total) * 100 : 0
          })) || []
        };
        
        setStats(transformedStats);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch attendance statistics",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance statistics",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      <div className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              onClick={handleExportAttendance}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Attendance History
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="attendance" className="gap-2">
                <Calendar className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Take Attendance</span>
                <span className="md:hidden">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-2">
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Student Management</span>
                <span className="md:hidden">Students</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="space-y-6 mt-0">
              <AttendanceFilters 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
              />
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-center">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={handleStartAttendance}
                  disabled={loading || students.length === 0 || !selectedCourseId}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {loading ? "Loading Students..." : "Start Attendance"}
                </Button>
              </div>
              
              <AttendanceActions />
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : !selectedCourseId ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Select a Course</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Please select a course to view and manage student attendance.
                  </p>
                </div>
              ) : students.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">No Students Available</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    This course has no students yet. Go to the "Add Students" page to add students to this course.
                  </p>
                </div>
              ) : (
                <AttendanceTable 
                  selectedDate={selectedDate}
                  selectedClass={selectedClass}
                  selectedSubject={selectedSubject}
                  students={students}
                  setStudents={setStudents}
                  selectedCourseId={selectedCourseId}
                />
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <StudentExcelUpload onUploadSuccess={handleUploadSuccess} />
                </div>
                
                <div className="lg:col-span-2">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : uploadedStudents.length > 0 ? (
                    <div className="space-y-6">
                      <StudentBatchFilter 
                        students={uploadedStudents} 
                        onSelectBatch={setSelectedBatch}
                        selectedBatch={selectedBatch}
                      />
                      
                      <StudentDataTable 
                        students={uploadedStudents}
                        selectedBatch={selectedBatch}
                        onAttendanceChange={handleAttendanceChange}
                        showAttendance={true}
                      />
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium mb-2">No Student Data Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Upload an Excel file with student details or add students through the "Add Students" page.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Student Data
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <AttendanceModal
            isOpen={attendanceModalOpen}
            onClose={() => setAttendanceModalOpen(false)}
            students={students}
            selectedDate={selectedDate}
            selectedSubject={selectedSubject}
            onSubmitAttendance={handleSubmitModalAttendance}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
