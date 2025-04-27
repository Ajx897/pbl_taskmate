
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export function AttendanceActions() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex-1">
        <h2 className="text-sm font-medium mb-2">Quick Actions</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Check className="h-4 w-4 mr-1" />
            Mark All Present
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <X className="h-4 w-4 mr-1" />
            Mark All Absent
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <h2 className="text-sm font-medium mb-2">Historical Records</h2>
        <Button variant="outline" size="sm" className="w-full">
          View Past Attendance
        </Button>
      </div>
    </div>
  );
}
