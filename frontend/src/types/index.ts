export interface Course {
  _id: string;
  name: string;
  code: string;
  students?: Student[];
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  year: string | number;
  courses?: string[];
}

export interface AttendanceRecord {
  _id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
} 