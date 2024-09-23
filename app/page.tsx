"use client";
import { TaskForm } from "./task-form";
import { Separator } from "@/lib/components/ui/separator";
import { TaskItem } from "./task-element";

import { useTasks } from "@/lib/providers/tasks-provider";
import { Skeleton } from "@/lib/components/ui/skeleton";

export default function Home() {
  const { tasks, isLoadingTasks } = useTasks();

  return (
    <main className="container mt-10">
      <h1 className="text-2xl font-medium my-10">TODO App</h1>

      <TaskForm />

      {tasks && tasks.length === 0 && (
        <p className="text-center text-muted-foreground">
          No hay tareas aún, crea una nueva!
        </p>
      )}

      <section className="mt-10">
        <h3 className="text-xl font-medium my-4">Tareas</h3>
        <Separator />

        <div className="grid gap-4 py-4">
          {isLoadingTasks && <SkeletonTasks />}
          {tasks && tasks.map((task) => <TaskItem task={task} key={task.id} />)}
        </div>
      </section>
    </main>
  );
}

function SkeletonTasks() {
  return (
    <>
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
    </>
  );
}
