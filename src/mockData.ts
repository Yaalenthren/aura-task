// mockData.ts
import type { Task } from "./types";

const today = new Date().toISOString().split("T")[0];

const getOffsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Finalize Q3 roadmap slide deck",
    description:
      "Consolidate input from Design and Engineering leads for Monday briefing.",
    status: "in-progress",
    priority: "high",
    category: "Work",
    dueDate: today,
  },
  {
    id: "task-2",
    title: "Complete TypeScript generics chapter",
    description:
      "Read chapters 4 & 5 and implement sample utility type exercises.",
    status: "todo",
    priority: "medium",
    category: "Study",
    dueDate: getOffsetDate(1),
  },
  {
    id: "task-3",
    title: "Schedule annual dental checkup",
    description: "Book morning slot with Dr. Miller clinic.",
    status: "done",
    priority: "low",
    category: "Health",
    dueDate: getOffsetDate(-2),
  },
  {
    id: "task-4",
    title: "Ship customer feedback survey",
    description:
      "Set up Typeform survey and send notification to 200 early adopters.",
    status: "todo",
    priority: "high",
    category: "Work",
    dueDate: getOffsetDate(-1), // Overdue
  },
  {
    id: "task-5",
    title: "30-minute cardio interval run",
    description: "Park loop interval session at Zone 3 heart rate.",
    status: "done",
    priority: "medium",
    category: "Health",
    dueDate: today,
  },
  {
    id: "task-6",
    title: "Submit quarterly tax estimates",
    description: "Verify expense categorizations with CPA portal.",
    status: "todo",
    priority: "high",
    category: "Personal",
    dueDate: getOffsetDate(4),
  },
  {
    id: "task-7",
    title: "Review pull request for auth refactor",
    description: "Ensure token refreshing is safe against race conditions.",
    status: "in-progress",
    priority: "medium",
    category: "Work",
    dueDate: today,
  },
  {
    id: "task-8",
    title: "Read System Design case study",
    description: "Study Uber H3 spatial index system design post.",
    status: "todo",
    priority: "low",
    category: "Study",
    dueDate: getOffsetDate(3),
  },
  {
    id: "task-9",
    title: "Order fresh groceries for meal prep",
    description: "Spinach, salmon fillets, sweet potatoes, olive oil.",
    status: "done",
    priority: "low",
    category: "Personal",
    dueDate: getOffsetDate(-3),
  },
  {
    id: "task-10",
    title: "Conduct weekly 1:1 with mentorship mentee",
    description: "Review interview practice and mock portfolio review.",
    status: "in-progress",
    priority: "medium",
    category: "Work",
    dueDate: getOffsetDate(2),
  },
  {
    id: "task-11",
    title: "Renew driver license online",
    description: "Complete state DMV online renewal form and pay fee.",
    status: "todo",
    priority: "high",
    category: "Personal",
    dueDate: getOffsetDate(-1), // Overdue
  },
  {
    id: "task-12",
    title: "Refill multivitamins & Omega-3",
    description: "Pick up supplement prescription from local pharmacy.",
    status: "todo",
    priority: "low",
    category: "Health",
    dueDate: getOffsetDate(5),
  },
];
