
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  subject: string;
  type: "assignment" | "exam" | "project";
}

const deadlines: Deadline[] = [
  {
    id: "1",
    title: "Midterm Exam",
    dueDate: "2023-10-30",
    subject: "Advanced Algorithms",
    type: "exam",
  },
  {
    id: "2",
    title: "Research Paper",
    dueDate: "2023-11-15",
    subject: "Data Science",
    type: "assignment",
  },
  {
    id: "3",
    title: "Final Project",
    dueDate: "2023-12-05",
    subject: "Software Engineering",
    type: "project",
  },
  {
    id: "4",
    title: "Case Study",
    dueDate: "2023-11-01",
    subject: "Business Ethics",
    type: "assignment",
  },
];

const typeColors = {
  assignment: "bg-blue-500",
  exam: "bg-red-500",
  project: "bg-green-500",
};

export function DeadlineTracker() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate how "urgent" a deadline is based on days remaining
  const getUrgencyClass = (daysRemaining: number) => {
    if (daysRemaining < 0) return "text-gray-500";
    if (daysRemaining <= 3) return "text-red-600 font-semibold";
    if (daysRemaining <= 7) return "text-amber-600";
    return "text-green-600";
  };

  return (
    <div className="glassmorphism rounded-xl animate-enter animate-delay-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
        <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
          <CalendarDays className="w-3.5 h-3.5" />
          Calendar
        </button>
      </div>
      
      <div className="p-4">
        <div className="space-y-6">
          {deadlines.map((deadline) => {
            const daysRemaining = getDaysRemaining(deadline.dueDate);
            const urgencyClass = getUrgencyClass(daysRemaining);
            
            return (
              <div key={deadline.id} className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div className={cn("w-3 h-3 rounded-full", typeColors[deadline.type])} />
                  {deadline.id !== deadlines[deadlines.length - 1].id && (
                    <div className="absolute top-3 left-1.5 w-[1px] h-[calc(100%+10px)] -ml-px bg-gray-200" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{deadline.title}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">{deadline.subject}</p>
                </div>
                
                <div className="text-right">
                  <div className={cn("text-sm font-medium", urgencyClass)}>
                    {daysRemaining < 0 
                      ? "Overdue" 
                      : daysRemaining === 0 
                        ? "Today" 
                        : daysRemaining === 1 
                          ? "Tomorrow" 
                          : `${daysRemaining} days`}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(deadline.dueDate)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a href="#" className="text-xs text-taskbuddy-blue font-medium hover:underline">
          View All Deadlines
        </a>
      </div>
    </div>
  );
}
