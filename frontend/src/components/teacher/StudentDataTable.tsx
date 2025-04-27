import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Student } from "@/pages/teacher/TeacherAttendancePage";

interface StudentDataTableProps {
  students: Student[];
  selectedBatch: string;
  onAttendanceChange?: (studentId: string, attendance: "present" | "absent") => void;
  showAttendance?: boolean;
}

export function StudentDataTable({
  students,
  selectedBatch,
  onAttendanceChange,
  showAttendance = false
}: StudentDataTableProps) {
  // Filter students by batch if a specific batch is selected
  const filteredStudents = selectedBatch === "all" 
    ? students 
    : students.filter(student => student.batch === selectedBatch);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-lg font-semibold">
          {selectedBatch === "all" ? "All Students" : `Batch ${selectedBatch} Students`}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
          Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="w-[100px]">Batch</TableHead>
              {showAttendance && (
                <TableHead className="text-center">Attendance</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs mr-2">
                        {student.name.charAt(0)}
                      </span>
                      {student.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      {student.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                      Batch {student.batch}
                    </span>
                  </TableCell>
                  {showAttendance && onAttendanceChange && (
                    <TableCell>
                      <RadioGroup
                        value={student.attendance || ""}
                        onValueChange={(value) => 
                          onAttendanceChange(
                            student.id, 
                            value as "present" | "absent"
                          )
                        }
                        className="flex justify-center space-x-4 sm:space-x-8"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`present-${student.id}`} />
                          <Label htmlFor={`present-${student.id}`} className="text-xs sm:text-sm">Present</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                          <Label htmlFor={`absent-${student.id}`} className="text-xs sm:text-sm">Absent</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showAttendance ? 5 : 4} className="text-center py-8 text-gray-500">
                  No students found for the selected batch
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {showAttendance && filteredStudents.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <div className="flex space-x-3">
            <Button variant="outline">Reset</Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Attendance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
