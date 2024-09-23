"use client";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Button } from "@/lib/components/ui/button";

import { Task } from "@/lib/schema/task-schema";

import { formatDate } from "@/lib/helpers/format-date";
import { deleteTask } from "@/lib/services/tasks-service";
import { revalidateTasks } from "@/lib/actions/task-actions";
import { useTasks } from "@/lib/providers/tasks-provider";

export function TaskItem({ task }: { task: Task }) {
  const { setEditTask } = useTasks();

  const handleDelete = async () => {
    toast.loading("Eliminando tarea...", {
      id: "delete-task",
    });

    const response = await deleteTask(task.id);

    if (!response.ok) {
      toast.error("No se pudo eliminar la tarea", {
        id: "delete-task",
      });
    } else {
      toast.success("Tarea eliminada con éxito", {
        id: "delete-task",
      });

      revalidateTasks();
    }
  };

  return (
    <article className="flex items-center gap-4 border rounded-md p-4">
      <aside>
        <Checkbox defaultChecked={task.completed} />
      </aside>

      <section className="grid flex-1">
        <span className="text-xs text-muted-foreground">
          {formatDate(task.createdAt)}
        </span>
        <h2>{task.title}</h2>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </section>

      <aside>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditTask(task)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDelete}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>
    </article>
  );
}
