import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/teacher/TeacherNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Search, UserPlus, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  _id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  program: string;
  year: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
  maxStudents: number;
}

const AddStudentPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingStudents, setAddingStudents] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    maxStudents: 50
  });

  useEffect(() => {
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }
    fetchCourses();
    fetchAvailableStudents();
  }, [token, navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/teacher/courses", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Ensure we have a valid array of courses
      const coursesData = response.data && Array.isArray(response.data) ? response.data : [];
      console.log("Fetched courses:", coursesData);
      setCourses(coursesData);
      
      // If we have courses and no course is selected, select the first one
      if (coursesData.length > 0 && !selectedCourseId) {
        console.log("Setting initial course:", coursesData[0]);
        setSelectedCourseId(coursesData[0]._id);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Redirect to login or handle authentication error
      } else {
        toast.error("Failed to fetch courses");
      }
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a useEffect to monitor course selection changes
  useEffect(() => {
    if (selectedCourseId) {
      console.log("Selected course changed:", selectedCourseId);
      const selectedCourse = courses.find(course => course._id === selectedCourseId);
      console.log("Selected course details:", selectedCourse);
    }
  }, [selectedCourseId, courses]);

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/teacher/available-students", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Ensure we have a valid array of students
      const studentsData = response.data && response.data.data && Array.isArray(response.data.data) 
        ? response.data.data 
        : [];
      setAvailableStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("Error fetching available students:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Redirect to login or handle authentication error
      } else {
        toast.error("Failed to fetch available students");
      }
      setAvailableStudents([]);
      setFilteredStudents([]);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredStudents(availableStudents);
      return;
    }
    
    const filtered = availableStudents.filter(student => {
      const searchStr = term.toLowerCase();
      const fullName = `${student.firstname || ""} ${student.lastname || ""}`.toLowerCase();
      const email = student.email.toLowerCase();
      return fullName.includes(searchStr) || email.includes(searchStr);
    });
    setFilteredStudents(filtered);
  };

  const handleCreateCourse = async () => {
    if (!newCourse.name || !newCourse.code) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsCreatingCourse(true);
      const response = await axios.post("http://localhost:5000/api/teacher/courses", {
        name: newCourse.name,
        code: newCourse.code,
        maxStudents: newCourse.maxStudents,
        credits: 3, // Required field
        description: `Course created by teacher`,
        startDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0], // 4 months from now
        schedule: "To be determined"
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.course) {
        setCourses(prevCourses => [...prevCourses, response.data.course]);
        setNewCourse({ name: "", code: "", maxStudents: 50 });
        toast.success("Course created successfully");
      } else {
        throw new Error("Invalid course data received");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          // Redirect to login or handle authentication error
        } else {
          toast.error(error.response?.data?.message || "Failed to create course");
        }
      } else {
        toast.error("Failed to create course");
      }
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      setAddingStudents(true);
      const selectedCourse = courses.find(course => course._id === selectedCourseId);
      
      // Log the full course ID and request details
      console.log("Adding students to course:", {
        courseId: selectedCourseId,
        courseName: selectedCourse?.name,
        studentIds: selectedStudents,
        requestUrl: `http://localhost:5000/api/teacher/courses/${selectedCourseId}/students`
      });

      // Ensure the course ID is properly encoded in the URL
      const response = await axios.post(
        `http://localhost:5000/api/teacher/courses/${encodeURIComponent(selectedCourseId)}/students`,
        {
          studentIds: selectedStudents
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Response from adding students:", response.data);

      if (response.data && response.data.addedCount) {
        toast.success(`Successfully added ${response.data.addedCount} students to the course`);
        setSelectedStudents([]);
        await fetchAvailableStudents(); // Refresh available students
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error adding students:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else if (error.response?.status === 404) {
          const selectedCourse = courses.find(course => course._id === selectedCourseId);
          toast.error(`Course "${selectedCourse?.name || selectedCourseId}" not found or you don't have permission to add students`);
        } else {
          toast.error(error.response?.data?.message || "Failed to add students");
        }
      } else {
        toast.error("Failed to add students");
      }
    } finally {
      setAddingStudents(false);
    }
  };

  return (
    <div className="min-h-screen bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      <div className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold">Add Students</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 mt-2 sm:mt-0"
              onClick={() => navigate("/teacher/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Students to Your Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Create New Course</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Course Name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    />
                    <Input
                      placeholder="Course Code"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max Students"
                      value={newCourse.maxStudents}
                      onChange={(e) => setNewCourse({ ...newCourse, maxStudents: parseInt(e.target.value) })}
                    />
                  </div>
                  <Button
                    onClick={handleCreateCourse}
                    disabled={isCreatingCourse || !newCourse.name || !newCourse.code}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Course</label>
                  <Select 
                    value={selectedCourseId} 
                    onValueChange={(value) => {
                      console.log("Course selection changed to:", value);
                      setSelectedCourseId(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses && courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.name} ({course.code})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-courses" disabled>No courses available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search students by name or email"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <div className="border rounded-lg">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Select</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Program</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents && filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                              <tr key={student._id} className="border-t">
                                <td className="px-4 py-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student._id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedStudents([...selectedStudents, student._id]);
                                      } else {
                                        setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                                      }
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  {student.firstname && student.lastname
                                    ? `${student.firstname} ${student.lastname}`
                                    : student.email.split("@")[0]}
                                </td>
                                <td className="px-4 py-2">{student.email}</td>
                                <td className="px-4 py-2">{student.program || "N/A"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                                {loading ? "Loading students..." : "No students available"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedStudents([])}
                      disabled={selectedStudents.length === 0}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      onClick={handleAddStudents}
                      disabled={addingStudents || selectedStudents.length === 0 || !selectedCourseId}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Selected Students
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage; 