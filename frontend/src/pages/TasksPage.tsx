
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskList } from "@/components/TaskList";
import { TaskCalendar } from "@/components/TaskCalendar";
import { TaskFilters } from "@/components/TaskFilters";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, ListFilter, BarChart2, TrendingUp, CheckSquare2 } from "lucide-react";
import { TaskDialog } from "@/components/TaskDialog";
import { Task, Priority, Status } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TasksPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStats, setShowStats] = useState(true); // Default to showing stats
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: "all" as "all" | Priority,
    status: "all" as "all" | Status,
  });

  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.priority === "all" || task.priority === filters.priority) &&
      (filters.status === "all" || task.status === filters.status)
    );
  });

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      id: String(tasks.length + 1),
      ...task,
    };
    setTasks([...tasks, newTask]);
    setIsAddTaskOpen(false);
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

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // Calculate task stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'not-started').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Tasks</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your academic tasks and deadlines</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowStats(!showStats)}
            >
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {showStats ? "Hide Stats" : "Show Stats"}
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? (
                <>
                  <ListFilter className="h-4 w-4" />
                  <span className="hidden sm:inline">List View</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar View</span>
                </>
              )}
            </Button>
            
            <Button className="gap-2" onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </header>

        {showStats && (
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-6 mb-6 animate-enter">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Task Completion Stats</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="dark:bg-gray-800/80 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckSquare2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold dark:text-white">{completionRate}%</p>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-1.5 py-0.5 rounded-full">+5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800/80 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Progress</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold dark:text-white">{completedTasks}/{totalTasks}</p>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-1.5 py-0.5 rounded-full">On Track</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800/80 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20">
                      <BarChart2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Task Status</p>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold dark:text-white">{notStartedTasks} Not Started</p>
                        <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>
                        <p className="text-base font-bold dark:text-white">{inProgressTasks} In Progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium mb-3 dark:text-white">Task Status Distribution</h3>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="h-20 bg-green-100 dark:bg-green-900/20 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-green-600 dark:text-green-500">{completedTasks}</span>
                    <span className="text-xs text-green-800 dark:text-green-400">Completed</span>
                  </div>
                  <div className="h-20 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-500">{inProgressTasks}</span>
                    <span className="text-xs text-amber-800 dark:text-amber-400">In Progress</span>
                  </div>
                  <div className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-600 dark:text-gray-400">{notStartedTasks}</span>
                    <span className="text-xs text-gray-800 dark:text-gray-400">Not Started</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium mb-3 dark:text-white">Task Priority Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-600 dark:text-red-500">High Priority</span>
                      <span className="dark:text-gray-300">
                        {tasks.filter(t => t.priority === 'high').length} tasks
                      </span>
                    </div>
                    <Progress 
                      value={tasks.filter(t => t.priority === 'high').length / totalTasks * 100} 
                      className="h-2 bg-gray-100 dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-600 dark:text-amber-500">Medium Priority</span>
                      <span className="dark:text-gray-300">
                        {tasks.filter(t => t.priority === 'medium').length} tasks
                      </span>
                    </div>
                    <Progress 
                      value={tasks.filter(t => t.priority === 'medium').length / totalTasks * 100} 
                      className="h-2 bg-gray-100 dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-600 dark:text-green-500">Low Priority</span>
                      <span className="dark:text-gray-300">
                        {tasks.filter(t => t.priority === 'low').length} tasks
                      </span>
                    </div>
                    <Progress 
                      value={tasks.filter(t => t.priority === 'low').length / totalTasks * 100} 
                      className="h-2 bg-gray-100 dark:bg-gray-700" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <TaskFilters filters={filters} setFilters={setFilters} />
        
        <div className="mt-6">
          {showCalendar ? (
            <TaskCalendar 
              tasks={filteredTasks} 
              onToggleStatus={toggleTaskStatus}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              onToggleStatus={toggleTaskStatus} 
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          )}
        </div>
      </main>

      <TaskDialog 
        open={isAddTaskOpen} 
        onOpenChange={setIsAddTaskOpen}
        onSubmit={addTask}
      />
    </div>
  );
}

// Initial tasks data
const initialTasks: Task[] = [
  {
    "id": "1",
    "title": "Algorithm Assignment",
    "dueDate": "2025-04-14",
    "priority": "high",
    "status": "in-progress",
    "subject": "Computer Science",
    "description": "Complete the dynamic programming assignment"
  },
  {
    "id": "2",
    "title": "Physics Lab Report",
    "dueDate": "2025-04-15",
    "priority": "medium",
    "status": "not-started",
    "subject": "Physics",
    "description": "Write up the results from experiment #3"
  },
  {
    "id": "3",
    "title": "Literature Essay",
    "dueDate": "2025-04-14",
    "priority": "high",
    "status": "completed",
    "subject": "English",
    "description": "5-page analysis of Hamlet"
  },
  {
    "id": "4",
    "title": "Mathematics Problem Set",
    "dueDate": "2025-04-16",
    "priority": "low",
    "status": "not-started",
    "subject": "Mathematics",
    "description": "Chapter 7 problems #1-20"
  },
  {
    "id": "5",
    "title": "Team Project Meeting",
    "dueDate": "2025-04-15",
    "priority": "medium",
    "status": "not-started",
    "subject": "Software Engineering",
    "description": "Weekly sprint planning with team"
  }
];
