
export type Priority = "high" | "medium" | "low";
export type Status = "completed" | "in-progress" | "not-started";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  subject: string;
  description?: string;
}
