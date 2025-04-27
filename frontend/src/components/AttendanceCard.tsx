
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  code: string;
  attendance: number;
  total: number;
}

const courses: Course[] = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS202",
    attendance: 10,
    total: 12,
  },
  {
    id: "2",
    name: "Calculus II",
    code: "MATH201",
    attendance: 15,
    total: 16,
  },
  {
    id: "3",
    name: "Physics",
    code: "PHYS101",
    attendance: 8,
    total: 12,
  },
  {
    id: "4",
    name: "Economics",
    code: "ECON105",
    attendance: 7,
    total: 10,
  },
];

export function AttendanceCard() {
  const getPercentage = (attendance: number, total: number) => {
    return Math.round((attendance / total) * 100);
  };

  // Generate color class based on attendance percentage
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="glassmorphism rounded-xl animate-enter animate-delay-300">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Attendance</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {courses.map((course) => {
          const percentage = getPercentage(course.attendance, course.total);
          const colorClass = getColorClass(percentage);
          
          return (
            <div key={course.id} className="p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-sm font-medium">{course.name}</h3>
                  <p className="text-xs text-gray-500">{course.code}</p>
                </div>
                <span className={cn("text-sm font-semibold", colorClass)}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className={cn(
                    "h-1.5 rounded-full",
                    percentage >= 90 ? "bg-green-500" : 
                    percentage >= 75 ? "bg-amber-500" : 
                    "bg-red-500"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {course.attendance} of {course.total} classes attended
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a href="#" className="text-xs text-taskbuddy-blue font-medium hover:underline">
          View Detailed Report
        </a>
      </div>
    </div>
  );
}
