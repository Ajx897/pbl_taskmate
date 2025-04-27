
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";

// Mock data for recent submissions
const recentSubmissions = [
  {
    id: "1",
    studentName: "Alex Johnson",
    class: "10-A",
    assignment: "Mathematics Assignment 3",
    submittedAt: new Date(2023, 6, 14, 15, 30),
    status: "on-time",
  },
  {
    id: "2",
    studentName: "Sam Wilson",
    class: "9-B",
    assignment: "Science Lab Report",
    submittedAt: new Date(2023, 6, 12, 23, 45),
    status: "late",
  },
  {
    id: "3",
    studentName: "Jordan Peterson",
    class: "10-A",
    assignment: "Mathematics Assignment 3",
    submittedAt: new Date(2023, 6, 13, 10, 15),
    status: "on-time",
  },
  {
    id: "4",
    studentName: "Casey Schmidt",
    class: "9-A",
    assignment: "History Essay",
    submittedAt: new Date(2023, 6, 11, 18, 20),
    status: "on-time",
  },
  {
    id: "5",
    studentName: "Riley Cooper",
    class: "9-B",
    assignment: "Science Lab Report",
    submittedAt: new Date(2023, 6, 13, 9, 5),
    status: "on-time",
  },
];

export function RecentSubmissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>Latest student submissions across all classes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.studentName}</TableCell>
                <TableCell>{submission.class}</TableCell>
                <TableCell>{submission.assignment}</TableCell>
                <TableCell>{format(submission.submittedAt, "MMM d, h:mm a")}</TableCell>
                <TableCell>
                  <Badge variant={submission.status === "on-time" ? "outline" : "destructive"}>
                    {submission.status === "on-time" ? "On Time" : "Late"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
