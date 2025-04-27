
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Plus 
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "completed" | "in-progress" | "not-started";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  subject: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Algorithm Assignment",
    dueDate: "2023-10-28",
    priority: "high",
    status: "in-progress",
    subject: "Computer Science",
  },
  {
    id: "2",
    title: "Physics Lab Report",
    dueDate: "2023-10-25",
    priority: "medium",
    status: "not-started",
    subject: "Physics",
  },
  {
    id: "3",
    title: "Literature Essay",
    dueDate: "2023-10-22",
    priority: "high",
    status: "completed",
    subject: "English",
  },
  {
    id: "4",
    title: "Mathematics Problem Set",
    dueDate: "2023-10-30",
    priority: "low",
    status: "not-started",
    subject: "Mathematics",
  },
];

const priorityClasses: Record<Priority, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const statusIcons: Record<Status, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  "in-progress": <Clock className="w-4 h-4 text-amber-600" />,
  "not-started": <AlertCircle className="w-4 h-4 text-gray-400" />,
};

export function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus: Status = 
            task.status === 'completed' ? 'not-started' :
            task.status === 'in-progress' ? 'completed' :
            'in-progress';
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  return (
    <div className="glassmorphism rounded-xl overflow-hidden animate-enter animate-delay-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button 
          className="text-xs bg-taskbuddy-purple text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-3"
          >
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className="flex-shrink-0"
              aria-label={`Mark task ${task.title} as ${task.status === 'completed' ? 'not started' : 'completed'}`}
            >
              {statusIcons[task.status]}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "text-sm font-medium",
                  task.status === "completed" && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  priorityClasses[task.priority]
                )}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>{task.subject}</span>
                <span>•</span>
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a href="#" className="text-xs text-taskbuddy-blue font-medium hover:underline">
          View All Tasks
        </a>
      </div>
    </div>
  );
}
