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
import { toast } from "sonner";

import { Task, TaskSchema } from "../schema/task-schema";
import {
  deleteTask,
  postTask,
  putTask,
  useSWRTasks,
} from "../services/tasks-service";

type TasksContextType = {
  tasks: Task[] | undefined;
  isLoadingTasks: boolean;
  editTask: Task | undefined;
  setEditTask: Dispatch<SetStateAction<Task | undefined>>;
  inProgress: boolean;
  addTask(task: TaskSchema, onSuccess?: () => void): Promise<void>;
  updateTask(task: TaskSchema, onSuccess?: () => void): Promise<void>;
  removeTask(taskId: string): Promise<void>;
  toggleCompleteTask(task: Task, completed: boolean): Promise<void>;
};

const TasksContext = createContext<TasksContextType | null>(null);

const toastTaskId = "task-provider-toast";

export function TasksProvider({ children }: { children: ReactNode }) {
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [inProgress, setInProgress] = useState(false);
  const { data, isLoading: isLoadingTasks, mutate } = useSWRTasks();

  const tasks = useMemo(() => data?.tasks, [data]);

  const addTask = async (data: TaskSchema, onSuccess?: () => void) => {
    try {
      setInProgress(true);
      toast.loading("Creando tarea...", {
        id: toastTaskId,
      });

      const response = await postTask(data);

      if (!response.ok) {
        toast.error("No se pudo crear la tarea", {
          id: toastTaskId,
        });
      } else {
        const { task } = (await response.json()) as {
          task: Task;
        };

        setEditTask(undefined);
        // Update tasks
        if (tasks) {
          mutate({
            tasks: [...tasks, task],
          });
        }

        toast.success("Tarea creada con éxito", {
          id: toastTaskId,
        });

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error creating task:", error);

      toast.error("Algo falló al crear la tarea", {
        id: toastTaskId,
      });
    } finally {
      setInProgress(false);
    }
  };

  const updateTask = async (data: TaskSchema, onSuccess: () => void) => {
    try {
      setInProgress(true);
      toast.loading("Actualizando tarea...", {
        id: toastTaskId,
      });

      const response = await putTask(data);

      if (!response.ok) {
        toast.error("No se pudo actualizar la tarea", {
          id: toastTaskId,
        });
      } else {
        const { task } = (await response.json()) as {
          task: Task;
        };

        setEditTask(undefined);
        // Update tasks
        if (tasks) {
          mutate({
            tasks: tasks.map((t) => {
              if (t.id === task.id) {
                return task;
              }

              return t;
            }),
          });
        }

        toast.success("Tarea actualizada con éxito", {
          id: toastTaskId,
        });

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error updating task:", error);

      toast.error("Algo falló al actualizar la tarea", {
        id: toastTaskId,
      });
    } finally {
      setInProgress(false);
    }
  };

  const toggleCompleteTask = async (data: Task, completed: boolean) => {
    try {
      const taskUpdated: Task = {
        ...data,
        completed,
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
      if (tasks) {
        mutate({
          tasks: tasks?.map((t) => (t.id === data.id ? taskUpdated : t)),
        });
      }

      const response = await putTask(taskUpdated);

      if (!response.ok) {
        toast.error("No se pudo completar la tarea", {
          id: toastTaskId,
        });
      } else {
        const { task } = (await response.json()) as {
          task: Task;
        };

        // Update tasks
        if (tasks) {
          mutate({
            tasks: tasks.map((t) => {
              if (t.id === task.id) {
                return task;
              }

              return t;
            }),
          });
        }
      }
    } catch (error) {
      console.error("Error completing task:", error);

      toast.error("Algo falló al completar la tarea", {
        id: toastTaskId,
      });

      // Revert optimistic update
      if (tasks) {
        mutate({
          tasks: tasks?.map((t) => (t.id === data.id ? data : t)),
        });
      }
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      setInProgress(true);

      toast.loading("Eliminando tarea...", {
        id: toastTaskId,
      });

      const response = await deleteTask(taskId);

      if (!response.ok) {
        toast.error("No se pudo eliminar la tarea", {
          id: toastTaskId,
        });
      } else {
        if (tasks) {
          mutate({
            tasks: tasks.filter((t) => t.id !== taskId),
          });
        }

        toast.success("Tarea eliminada con éxito", {
          id: toastTaskId,
        });
      }
    } catch (error) {
      console.error("Error removing task:", error);

      toast.error("Algo falló al eliminar la tarea", {
        id: toastTaskId,
      });
    } finally {
      setInProgress(false);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoadingTasks,
        editTask,
        setEditTask,
        inProgress,
        addTask,
        updateTask,
        removeTask,
        toggleCompleteTask,
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
