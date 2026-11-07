import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task } from "./types";
import { INITIAL_TASKS } from "./mockData";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  toggleStatus: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("auratask_data");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem("auratask_data", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = { ...taskData, id: `task-${Date.now()}` };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus = t.status === "done" ? "todo" : "done";
        return { ...t, status: nextStatus };
      })
    );
  };

  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        toggleStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
