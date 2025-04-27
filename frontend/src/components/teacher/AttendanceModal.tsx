import { useState, useEffect } from "react";
import { Check, X, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/pages/teacher/TeacherAttendancePage";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedDate: Date;
  selectedSubject: string;
  onSubmitAttendance: (students: Student[]) => void;
}

export function AttendanceModal({
  isOpen,
  onClose,
  students: initialStudents,
  selectedDate,
  selectedSubject,
  onSubmitAttendance,
}: AttendanceModalProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setCompleted(false);
      setStudents(initialStudents);
    }
  }, [isOpen, initialStudents]);

  const currentStudent = students[currentIndex];
  const progress = currentIndex / students.length * 100;
  const allMarked = students.every(student => student.attendance !== null);

  const handleMarkAttendance = (attendance: "present" | "absent") => {
    const updatedStudents = [...students];
    updatedStudents[currentIndex] = {
      ...updatedStudents[currentIndex],
      attendance
    };
    setStudents(updatedStudents);

    if (currentIndex < students.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleDownloadAttendance = () => {
    const headers = "Roll Number,Name,Status\n";
    const csv = students.reduce((acc, student) => {
      return acc + `${student.rollNumber},"${student.name}",${student.attendance}\n`;
    }, headers);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `attendance-${format(selectedDate, 'yyyy-MM-dd')}-${selectedSubject}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Attendance Downloaded",
      description: `Attendance for ${format(selectedDate, 'PPP')} has been downloaded as CSV`,
    });
  };

  const handleSubmit = () => {
    if (!allMarked) {
      toast({
        title: "Incomplete Attendance",
        description: "Please mark attendance for all students",
        variant: "destructive",
      });
      return;
    }

    onSubmitAttendance(students);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {!completed ? (
          <>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                {selectedSubject} - {format(selectedDate, "PPP")}
              </DialogDescription>
            </DialogHeader>
            
            {currentStudent && (
              <div className="py-6">
                <div className="mb-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      Roll No: {currentStudent.rollNumber}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{currentStudent.name}</h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <Button 
                    className="flex-1 py-6 text-lg" 
                    variant="outline" 
                    onClick={() => handleMarkAttendance("present")}
                  >
                    <Check className="h-6 w-6 mr-2" />
                    Present
                  </Button>
                  <Button 
                    className="flex-1 py-6 text-lg" 
                    variant="outline" 
                    onClick={() => handleMarkAttendance("absent")}
                  >
                    <X className="h-6 w-6 mr-2" />
                    Absent
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-2">
              <div className="flex items-center justify-between mb-1 text-sm">
                <span>Progress: {currentIndex + 1} of {students.length} students</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              {currentIndex < students.length - 1 && (
                <Button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  disabled={currentStudent?.attendance === null}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Skip to Next
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Attendance Complete</DialogTitle>
              <DialogDescription>
                You've marked attendance for all students.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-full mb-4">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">All Done!</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Attendance has been marked for {students.length} students.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-sm border rounded-lg overflow-hidden mb-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3">
                  <div className="font-semibold text-lg">
                    {students.filter(s => s.attendance === "present").length}
                  </div>
                  <div className="text-muted-foreground">Present</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3">
                  <div className="font-semibold text-lg">
                    {students.filter(s => s.attendance === "absent").length}
                  </div>
                  <div className="text-muted-foreground">Absent</div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="sm:order-1 w-full sm:w-auto"
                onClick={handleDownloadAttendance}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Attendance
              </Button>
              <Button
                className="sm:order-2 w-full sm:w-auto"
                onClick={handleSubmit}
              >
                Submit Attendance
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
