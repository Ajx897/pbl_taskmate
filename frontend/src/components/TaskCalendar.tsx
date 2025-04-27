
import { useState } from "react";
import { Task } from "@/types/task";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TaskDialog } from "./TaskDialog";

interface TaskCalendarProps {
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

export function TaskCalendar({ tasks, onToggleStatus, onDeleteTask, onUpdateTask }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get tasks for the selected date
  const tasksForSelectedDate = selectedDate
    ? tasks.filter(task => 
        isSameDay(parseISO(task.dueDate), selectedDate)
      )
    : [];

  // Calculate days with tasks for the calendar highlighting
  const taskDates = tasks.reduce<Record<string, { count: number; hasHighPriority: boolean }>>(
    (acc, task) => {
      const dateStr = task.dueDate;
      if (!acc[dateStr]) {
        acc[dateStr] = { count: 0, hasHighPriority: false };
      }
      acc[dateStr].count += 1;
      if (task.priority === "high") {
        acc[dateStr].hasHighPriority = true;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <Card className="glassmorphism lg:col-span-3 xl:col-span-2">
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-3 pointer-events-auto"
            modifiers={{
              highlighted: Object.keys(taskDates).map(date => parseISO(date)),
            }}
            modifiersStyles={{
              highlighted: {
                fontWeight: 600,
              },
            }}
            components={{
              DayContent: (props) => {
                const dateStr = format(props.date, "yyyy-MM-dd");
                const taskData = taskDates[dateStr];
                
                return (
                  <div className="relative h-full w-full p-2">
                    <div>{props.date.getDate()}</div>
                    {taskData && (
                      <div
                        className={cn(
                          "absolute bottom-1 right-1 flex items-center justify-center rounded-full w-4 h-4 text-[9px]",
                          taskData.hasHighPriority
                            ? "bg-red-500 text-white"
                            : "bg-taskbuddy-blue text-white"
                        )}
                      >
                        {taskData.count}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="glassmorphism lg:col-span-4 xl:col-span-5">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-taskbuddy-blue/10 to-taskbuddy-purple/10">
            <h2 className="font-medium">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
              {tasksForSelectedDate.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'})
                </span>
              )}
            </h2>
          </div>

          {tasksForSelectedDate.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {tasksForSelectedDate.map(task => (
                <div 
                  key={task.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      aria-label={`Mark task ${task.title} as ${task.status === 'completed' ? 'not started' : 'completed'}`}
                    >
                      {statusIcons[task.status]}
                    </button>
                    <div className="flex-1">
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
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{task.subject}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-gray-500 hover:text-taskbuddy-blue p-1 rounded-full hover:bg-gray-100"
                      >
                        <span className="sr-only">Edit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                      >
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-600">No tasks for this date</h3>
              <p className="text-gray-500 mt-2">
                Select a different date or add a new task
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={onUpdateTask}
          defaultValues={editingTask}
          mode="edit"
        />
      )}
    </div>
  );
}
