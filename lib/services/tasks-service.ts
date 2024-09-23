import useSWR from "swr";

import { fetcher } from "../helpers/fetcher";
import { Task, TaskSchema } from "../schema/task-schema";

export const useSWRTasks = () => {
  const { data, isLoading, error, mutate, isValidating } = useSWR<{
    tasks: Task[];
  }>("/api/tasks", fetcher);

  return {
    data,
    isLoading,
    error,
    mutate,
    isValidating,
  };
};

export const getTasks = (signal?: AbortSignal): Promise<Response> => {
  return fetch("http://localhost:3000/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
};

export const postTask = (
  task: TaskSchema,
  signal?: AbortSignal
): Promise<Response> => {
  return fetch("http://localhost:3000/api/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
    signal,
  });
};

export const putTask = (
  task: TaskSchema,
  signal?: AbortSignal
): Promise<Response> => {
  return fetch(`http://localhost:3000/api/task/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
    signal,
  });
};

export const deleteTask = (
  id: string,
  signal?: AbortSignal
): Promise<Response> => {
  return fetch(`http://localhost:3000/api/task/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
};
