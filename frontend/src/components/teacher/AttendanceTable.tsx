import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/pages/teacher/TeacherAttendancePage";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";

interface AttendanceTableProps {
  selectedDate: Date;
  selectedClass: string;
  selectedSubject: string;
  students: Student[];
  setStudents: (students: Student[]) => void;
  selectedCourseId: string;
}

export const AttendanceTable = ({
  selectedDate,
  selectedClass,
  selectedSubject,
  students,
  setStudents,
  selectedCourseId,
}: AttendanceTableProps) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});

  const handleAttendanceChange = async (studentId: string, status: "present" | "absent") => {
    try {
      if (!selectedCourseId) {
        toast({
          title: "Error",
          description: "Please select a course first",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(prev => ({ ...prev, [studentId]: true }));
      
      // Debug logging
      console.log('Marking attendance:', {
        studentId,
        courseId: selectedCourseId,
        date: selectedDate.toISOString().split("T")[0],
        status,
        token: token ? 'Token exists' : 'No token'
      });

      // Update local state immediately for better UX
      setStudents(
        students.map((student) =>
          student._id === studentId ? { ...student, attendance: status } : student
        )
      );

      // Make API call to update attendance
      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark",
        {
          studentId: studentId,
          courseId: selectedCourseId,
          date: selectedDate.toISOString().split("T")[0],
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: `Attendance marked as ${status} for ${students.find(s => s._id === studentId)?.name}`,
        });
      } else {
        throw new Error(response.data.message || "Failed to mark attendance");
      }
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      console.error("Error response:", error.response?.data);
      
      // Revert the local state change on error
      setStudents(
        students.map((student) =>
          student._id === studentId ? { ...student, attendance: null } : student
        )
      );

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, [studentId]: false }));
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-lg font-semibold">
          Attendance for {format(selectedDate, "PPP")}
        </h2>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Fetch Students
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.rollNumber || "N/A"}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={student.attendance === "present" ? "default" : "outline"}
                      className={`${
                        student.attendance === "present"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                      onClick={() => handleAttendanceChange(student.id, "present")}
                      disabled={isSubmitting[student.id]}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={student.attendance === "absent" ? "default" : "outline"}
                      className={`${
                        student.attendance === "absent"
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                      }`}
                      onClick={() => handleAttendanceChange(student.id, "absent")}
                      disabled={isSubmitting[student.id]}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
