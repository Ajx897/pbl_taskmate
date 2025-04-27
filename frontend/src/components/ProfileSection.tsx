import { BookOpen, Award, Calendar, CheckSquare, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { ProfileUpdateModal } from "./ProfileUpdateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap } from "lucide-react";

interface ProfileData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  program: string;
  year: string;
  gpa: number;
  courses: any[];
  studyHours: number;
  assignments: any[];
  submissions: any[];
  name: string;
}

export function ProfileSection() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchProfileData = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Get user role from token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userRole = tokenData.role;

      // Use the correct endpoint based on user role
      const endpoint = userRole === 'teacher' 
        ? `${import.meta.env.VITE_API_URL}/api/teacher/profile`
        : `${import.meta.env.VITE_API_URL}/api/student/profile`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        // Ensure all required fields exist with default values
        const data = {
          ...response.data,
          courses: response.data.courses || [],
          assignments: response.data.assignments || [],
          submissions: response.data.submissions || [],
          studyHours: response.data.studyHours || 0,
          gpa: response.data.gpa || 0,
        };
        setProfileData(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [token]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profileData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      name: "Tasks Completed",
      value: profileData.assignments?.length?.toString() || "0",
      icon: <CheckSquare className="w-4 h-4 text-taskbuddy-purple" />,
    },
    {
      name: "Current GPA",
      value: profileData.gpa?.toFixed(2) || "0.00",
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
    {
      name: "Courses",
      value: profileData.courses?.length?.toString() || "0",
      icon: <BookOpen className="w-4 h-4 text-taskbuddy-blue" />,
    },
    {
      name: "Study Hours",
      value: profileData.studyHours?.toString() || "0",
      icon: <Calendar className="w-4 h-4 text-green-500" />,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback>
              {profileData.firstname?.[0]}{profileData.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">
              {profileData.firstname} {profileData.lastname}
            </h3>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>{profileData.program}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Year {profileData.year}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">GPA</p>
              <p className="text-2xl font-bold">{profileData.gpa?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Study Hours</p>
              <p className="text-2xl font-bold">{profileData.studyHours || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Courses</p>
              <p className="text-xl font-bold">{profileData.courses?.length || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assignments</p>
              <p className="text-xl font-bold">{profileData.assignments?.length || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Submissions</p>
              <p className="text-xl font-bold">{profileData.submissions?.length || 0}</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsUpdateModalOpen(true)}
            className="w-full mt-4"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>

      <ProfileUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={fetchProfileData}
        initialData={{
          gpa: profileData.gpa || 0,
          studyHours: profileData.studyHours || 0
        }}
      />
    </Card>
  );
}
