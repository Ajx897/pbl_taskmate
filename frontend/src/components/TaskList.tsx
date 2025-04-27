
import { useState } from "react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import { format, isToday, isPast, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskDialog } from "@/components/TaskDialog";

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}

const priorityClasses = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const statusIcons = {
  completed: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  "in-progress": <Clock className="w-4 h-4 text-amber-600" />,
  "not-started": <AlertCircle className="w-4 h-4 text-gray-400" />,
};

export function TaskList({ tasks, onToggleStatus, onDeleteTask, onUpdateTask }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Group tasks by date
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const groupedTasks: Record<string, Task[]> = {};
  
  sortedTasks.forEach(task => {
    // Format the date
    const taskDate = parseISO(task.dueDate);
    let dateLabel = "";
    
    if (isToday(taskDate)) {
      dateLabel = "Today";
    } else if (isPast(taskDate)) {
      dateLabel = "Overdue";
    } else {
      dateLabel = format(taskDate, "MMMM d, yyyy");
    }
    
    if (!groupedTasks[dateLabel]) {
      groupedTasks[dateLabel] = [];
    }
    
    groupedTasks[dateLabel].push(task);
  });

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([dateLabel, dateGroup]) => (
        <div key={dateLabel} className="glassmorphism rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-taskbuddy-blue/10 to-taskbuddy-purple/10 border-b border-gray-100">
            <h2 className="text-md font-medium">
              {dateLabel}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({dateGroup.length} {dateGroup.length === 1 ? 'task' : 'tasks'})
              </span>
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {dateGroup.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-3",
                  dateLabel === "Overdue" && task.status !== "completed" && "bg-red-50/50"
                )}
              >
                <button
                  onClick={() => onToggleStatus(task.id)}
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
                  {task.description && (
                    <p className="text-xs text-gray-600 mt-1 overflow-hidden text-ellipsis">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{task.subject}</span>
                    <span>•</span>
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex-shrink-0">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600" 
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="glassmorphism rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600">No tasks found</h3>
          <p className="text-gray-500 mt-2">
            Add a new task to get started or adjust your filters
          </p>
        </div>
      )}

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          defaultValues={editingTask}
          mode="edit"
        />
      )}
    </div>
  );
}
