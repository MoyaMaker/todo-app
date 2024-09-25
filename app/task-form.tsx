"use client";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import { TaskSchema, taskSchema } from "@/lib/schema/task-schema";
import { useTasks } from "@/lib/providers/tasks-provider";

export function TaskForm() {
  const { editTask, addTask, updateTask, inProgress } = useTasks();

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
    // Update task
    if (editTask?.id) {
      await updateTask(data, () => resetForm());
    } else {
      // Create task
      await addTask(data, () => resetForm());
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
        <Input type="text" id="title" {...form.register("title")} autoFocus />
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
        <Button type="submit" aria-disabled={inProgress}>
          Crear
        </Button>
      </footer>
    </form>
  );
}
