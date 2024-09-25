"use client";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Button } from "@/lib/components/ui/button";

import { Task } from "@/lib/schema/task-schema";

import { formatDate } from "@/lib/helpers/format-date";
import { useTasks } from "@/lib/providers/tasks-provider";

export function TaskItem({ task }: { task: Task }) {
  const { setEditTask, inProgress, removeTask, toggleCompleteTask } =
    useTasks();

  return (
    <article
      key={JSON.stringify(task)}
      className="flex items-center gap-4 border rounded-md p-4"
    >
      <aside className="flex">
        <Checkbox
          defaultChecked={task.completed}
          onCheckedChange={(checked) =>
            toggleCompleteTask(task, checked as boolean)
          }
        />
      </aside>

      <section className="grid flex-1">
        {task.completed ? (
          <span className="text-xs text-muted-foreground">
            Completada: {formatDate(task.updatedAt)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {formatDate(task.createdAt)}
          </span>
        )}
        <h2>{task.title}</h2>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </section>

      <aside>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={inProgress}>
            <Button variant="ghost">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setEditTask(task)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => removeTask(task.id)}>
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>
    </article>
  );
}
