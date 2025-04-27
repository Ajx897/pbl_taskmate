
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash, Eye } from "lucide-react";

// Mock data for past deadlines
const mockDeadlines = [
  {
    id: "1",
    title: "Mathematics Assignment 3",
    subject: "Mathematics",
    dueDate: new Date(2023, 6, 15, 23, 59),
    sentTo: "Class 10-A",
    status: "active",
    responses: 18,
    totalStudents: 25,
  },
  {
    id: "2",
    title: "Science Lab Report",
    subject: "Science",
    dueDate: new Date(2023, 6, 10, 23, 59),
    sentTo: "Class 9-B",
    status: "completed",
    responses: 22,
    totalStudents: 24,
  },
  {
    id: "3",
    title: "History Essay",
    subject: "History",
    dueDate: new Date(2023, 6, 5, 23, 59),
    sentTo: "Class 9-A",
    status: "completed",
    responses: 20,
    totalStudents: 26,
  }
];

export function PastDeadlines() {
  return (
    <div className="space-y-6">
      {mockDeadlines.map((deadline) => (
        <Card key={deadline.id} className="dark:border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{deadline.title}</CardTitle>
                <CardDescription>{deadline.subject}</CardDescription>
              </div>
              <Badge variant={deadline.status === "active" ? "default" : "secondary"}>
                {deadline.status === "active" ? "Active" : "Completed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{format(deadline.dueDate, "PPP 'at' p")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent To</p>
                <p className="font-medium">{deadline.sentTo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student Responses</p>
                <p className="font-medium">
                  {deadline.responses} / {deadline.totalStudents} 
                  <span className="text-sm text-muted-foreground ml-1">
                    ({Math.round((deadline.responses / deadline.totalStudents) * 100)}%)
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Button>
            {deadline.status === "active" && (
              <>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
