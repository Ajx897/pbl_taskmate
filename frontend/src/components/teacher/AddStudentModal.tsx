import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search, UserPlus } from "lucide-react";

interface Student {
  _id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  program: string;
  year: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onStudentAdded: () => void;
}

export function AddStudentModal({
  isOpen,
  onClose,
  courseId,
  onStudentAdded,
}: AddStudentModalProps) {
  const { token } = useAuth();
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingStudents, setAddingStudents] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = availableStudents.filter(
        (student) =>
          (student.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (student.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(availableStudents);
    }
  }, [searchTerm, availableStudents]);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/teacher/available-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Ensure we're getting the data array from the response
      const studentsData = response.data.data || [];
      setAvailableStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("Error fetching available students:", error);
      toast.error("Failed to fetch available students");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((student) => student._id));
    }
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.warning("Please select at least one student");
      return;
    }

    try {
      setAddingStudents(true);
      await axios.post(
        `/api/teacher/courses/${courseId}/students`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Students added successfully");
      onStudentAdded();
      onClose();
    } catch (error) {
      console.error("Error adding students:", error);
      toast.error("Failed to add students");
    } finally {
      setAddingStudents(false);
    }
  };

  // Helper function to get display name for a student
  const getStudentDisplayName = (student: Student) => {
    if (student.firstname && student.lastname) {
      return `${student.firstname} ${student.lastname}`;
    }
    // If firstname/lastname are not available, use email as fallback
    return student.email.split('@')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Students to Course</DialogTitle>
          <DialogDescription>
            Select students to add to your course. You can search by name or email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudents.length === filteredStudents.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student._id)}
                          onCheckedChange={() => handleSelectStudent(student._id)}
                        />
                      </TableCell>
                      <TableCell>
                        {getStudentDisplayName(student)}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>{student.year}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddStudents}
            disabled={selectedStudents.length === 0 || addingStudents}
          >
            {addingStudents ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Selected Students
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 