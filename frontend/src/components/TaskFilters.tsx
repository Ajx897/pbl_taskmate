
import { Priority, Status } from "@/types/task";
import { Flame, Check, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskFiltersProps {
  filters: {
    priority: "all" | Priority;
    status: "all" | Status;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      priority: "all" | Priority;
      status: "all" | Status;
    }>
  >;
}

export function TaskFilters({ filters, setFilters }: TaskFiltersProps) {
  const priorityOptions = [
    { value: "all", label: "All Priorities", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    { value: "high", label: "High", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    { value: "medium", label: "Medium", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: null },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <Check className="h-3 w-3" /> },
    { value: "in-progress", label: "In Progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: <Clock className="h-3 w-3" /> },
    { value: "not-started", label: "Not Started", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: <Clock className="h-3 w-3" /> }
  ];

  return (
    <div className="glassmorphism rounded-xl p-5 animate-enter">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-sm">Priority</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((option) => (
              <Badge
                key={option.value}
                variant="outline"
                className={`cursor-pointer hover:opacity-80 transition-all ${
                  filters.priority === option.value
                    ? `${option.color} border-2`
                    : "bg-white dark:bg-gray-800"
                }`}
                onClick={() => setFilters(f => ({ ...f, priority: option.value as "all" | Priority }))}
              >
                {option.value !== "all" && <Flame className="h-3 w-3 mr-1" />}
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-sm">Status</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Badge
                key={option.value}
                variant="outline"
                className={`cursor-pointer hover:opacity-80 transition-all ${
                  filters.status === option.value
                    ? `${option.color} border-2`
                    : "bg-white dark:bg-gray-800"
                }`}
                onClick={() => setFilters(f => ({ ...f, status: option.value as "all" | Status }))}
              >
                {option.icon}
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
