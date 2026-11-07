export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";
export type Category = "Work" | "Study" | "Personal" | "Health";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: Category;
  dueDate: string; // YYYY-MM-DD
}

export interface User {
  name: string;
  email: string;
}
