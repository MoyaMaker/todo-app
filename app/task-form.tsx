"use client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import { TaskSchema, taskSchema } from "@/lib/schema/task-schema";
import { postTask, putTask } from "@/lib/services/tasks-service";
import { revalidateTasks } from "@/lib/actions/task-actions";
import { useTasks } from "@/lib/providers/tasks-provider";

export function TaskForm() {
  const [pending, setPending] = useState(false);
  const { editTask, setEditTask } = useTasks();

  const form = useForm<TaskSchema>({
    mode: "onSubmit",
    defaultValues: {
      id: "",
      title: "",
      description: "",
    },
    resolver: zodResolver(taskSchema),
  });

  const onSubmit: SubmitHandler<TaskSchema> = async (data) => {
    try {
      setPending(true);

      // Update task
      if (editTask?.id) {
        toast.loading("Actualizando tarea...", {
          id: "form-task",
        });

        const response = await putTask(data);

        if (!response.ok) {
          toast.error("No se pudo actualizar la tarea", {
            id: "form-task",
          });
        } else {
          revalidateTasks();

          toast.success("Tarea actualizada con éxito", {
            id: "form-task",
          });

          resetForm();
          setEditTask(undefined);
        }
      } else {
        // Create task
        toast.loading("Creando tarea...", {
          id: "form-task",
        });

        const response = await postTask(data);

        if (!response.ok) {
          toast.error("No se pudo crear la tarea", {
            id: "form-task",
          });
        } else {
          revalidateTasks();

          toast.success("Tarea creada con éxito", {
            id: "form-task",
          });

          resetForm();
          setEditTask(undefined);
        }
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Algo salió mal creando la tarea", {
        id: "form-task",
      });
    } finally {
      setPending(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: "",
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    if (editTask) {
      form.reset(editTask);
    }
  }, [form, editTask]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 mt-10">
      <fieldset className="grid gap-4">
        <Label htmlFor="title">Título</Label>
        <Input type="text" id="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-error">
            {form.formState.errors.title.message}
          </p>
        )}
      </fieldset>

      <fieldset className="grid gap-4">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-error">
            {form.formState.errors.description.message}
          </p>
        )}
      </fieldset>

      <footer className="flex justify-end gap-4">
        <Button type="submit" aria-disabled={pending}>
          Crear
        </Button>
      </footer>
    </form>
  );
}
