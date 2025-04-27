
import { Plus, FileText, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  { name: "Course Syllabus.pdf", type: "pdf", size: "2.3 MB", date: "Oct 15, 2023" },
  { name: "Week 5 Notes.docx", type: "doc", size: "1.5 MB", date: "Oct 18, 2023" },
  { name: "Project Guidelines.pdf", type: "pdf", size: "3.1 MB", date: "Oct 10, 2023" },
  { name: "Study Guide.pdf", type: "pdf", size: "4.2 MB", date: "Oct 20, 2023" }
];

export function ResourcesList() {
  return (
    <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold dark:text-white">Shared Resources</h3>
        <Button className="gap-2" size="sm">
          <Plus className="h-3.5 w-3.5" />
          <span>Upload</span>
        </Button>
      </div>
      
      <div className="space-y-2">
        {resources.map((resource, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-taskbuddy-blue/10 dark:bg-taskbuddy-purple/20 p-2 rounded text-taskbuddy-blue dark:text-taskbuddy-purple">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium dark:text-white">{resource.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{resource.size} • {resource.date}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
