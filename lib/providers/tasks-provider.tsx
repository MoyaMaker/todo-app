"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import { Task } from "../schema/task-schema";
import { useSWRTasks } from "../services/tasks-service";

type TasksContextType = {
  tasks: Task[] | undefined;
  isLoadingTasks: boolean;
  editTask: Task | undefined;
  setEditTask: Dispatch<SetStateAction<Task | undefined>>;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [editTask, setEditTask] = useState<Task | undefined>();
  const { data, isLoading: isLoadingTasks } = useSWRTasks();

  const tasks = useMemo(() => data?.tasks, [data]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoadingTasks,
        editTask,
        setEditTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks has to be used within <TasksContext.Provider>");
  }

  return context;
};
