
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock } from "lucide-react";

// Mock data for upcoming deadlines
const upcomingDeadlines = [
  {
    id: "1",
    title: "Mathematics Assignment 4",
    subject: "Mathematics",
    dueDate: new Date(2023, 7, 15, 23, 59),
    class: "Class 10-A",
  },
  {
    id: "2",
    title: "Science Lab Report",
    subject: "Science",
    dueDate: new Date(2023, 7, 10, 23, 59),
    class: "Class 9-B",
  },
  {
    id: "3",
    title: "History Essay",
    subject: "History",
    dueDate: new Date(2023, 7, 5, 23, 59),
    class: "Class 9-A",
  },
];

export function UpcomingDeadlines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Assignments due in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {upcomingDeadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-start pb-4 last:pb-0 border-b last:border-0 border-gray-200 dark:border-gray-700">
              <div className="mr-4 mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <div className="font-semibold">{deadline.title}</div>
                <div className="text-sm text-muted-foreground">{deadline.subject} | {deadline.class}</div>
                <div className="mt-1 text-sm">
                  Due on <span className="font-medium">{format(deadline.dueDate, "PPP 'at' p")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
