import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users } from "lucide-react";
import { Student } from "@/pages/teacher/TeacherAttendancePage";

interface StudentBatchFilterProps {
  students: Student[];
  onSelectBatch: (batch: string) => void;
  selectedBatch: string;
}

export function StudentBatchFilter({ 
  students, 
  onSelectBatch,
  selectedBatch
}: StudentBatchFilterProps) {
  // Get unique batches from student data
  const batches = Array.from(new Set(students.map(student => student.batch)));
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium mb-1">Student Batches</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a batch to view and manage students
          </p>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <Users className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Total Students: <strong>{students.length}</strong>
          </span>
        </div>
      </div>
      
      <Tabs value={selectedBatch || "all"} onValueChange={onSelectBatch} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto pb-1">
          <TabsTrigger value="all" className="rounded-full">
            All Students
          </TabsTrigger>
          {batches.sort().map(batch => (
            <TabsTrigger 
              key={batch} 
              value={batch} 
              className="rounded-full"
            >
              Batch {batch}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
        {batches.map(batch => {
          const count = students.filter(s => s.batch === batch).length;
          return (
            <Button
              key={batch}
              variant="outline"
              size="sm"
              className={`text-xs ${selectedBatch === batch ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              onClick={() => onSelectBatch(batch)}
            >
              <User className="h-3 w-3 mr-1" /> 
              Batch {batch} ({count})
            </Button>
          );
        })}
      </div>
    </div>
  );
}
