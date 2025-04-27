import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Award, Calendar, User } from "lucide-react";

interface UserProfile {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  program?: string;
  year?: string;
  gpa?: number;
  courses?: Array<{
    _id: string;
    name: string;
    code: string;
    credits: number;
  }>;
  studyHours?: number;
  assignments?: any[];
  submissions?: any[];
  name?: string;
  department?: string;
}

export function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        setError("No authentication token found");
        return;
      }

      try {
        // Get user role from token
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userRole = tokenData.role;
        
        console.log("User role from token:", userRole);
        
        // Use the correct endpoint based on user role
        const endpoint = userRole === 'teacher' 
          ? 'http://localhost:5000/api/teacher/profile'
          : 'http://localhost:5000/api/student/profile';
        
        console.log("Using endpoint:", endpoint);
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log("Profile data:", response.data);
        setUserProfile(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (loading) {
    return <div className="p-6 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (error || !userProfile) {
    return <div className="p-6 text-center text-red-500">
      {error || "Error loading profile"}
    </div>;
  }

  // Determine if this is a student or teacher profile
  const isStudent = userProfile.program !== undefined;
  const isTeacher = userProfile.department !== undefined;

  return (
    <div className="p-6 space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">
                {userProfile.name || `${userProfile.firstname} ${userProfile.lastname}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userProfile.email}</p>
            </div>
            {isStudent && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium">{userProfile.program || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{userProfile.year || 'Not set'}</p>
                </div>
              </>
            )}
            {isTeacher && (
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{userProfile.department || 'Not set'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isStudent && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  GPA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userProfile.gpa?.toFixed(2) || "0.00"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userProfile.courses?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Study Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userProfile.studyHours || 0}</p>
              </CardContent>
            </Card>
          </>
        )}
        
        {isTeacher && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userProfile.courses?.length || 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Courses List */}
      {userProfile.courses && userProfile.courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{isStudent ? 'Enrolled Courses' : 'Teaching Courses'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProfile.courses.map((course) => (
                <div key={course._id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-gray-500">Code: {course.code}</p>
                  </div>
                  {course.credits && (
                    <div className="text-sm text-gray-500">
                      Credits: {course.credits}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 