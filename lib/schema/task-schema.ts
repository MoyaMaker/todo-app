import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z
    .string({
      message: "Título es obligatorio",
    })
    .min(3, {
      message: "El título debe tener al menos 3 caracteres",
    }),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

export type TaskSchema = z.infer<typeof taskSchema>;

export type Task = TaskSchema & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
