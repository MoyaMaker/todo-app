import fs from "fs";
import path from "path";
import { Task } from "./schema/task-schema";

export class TaskDB {
  private filePath = path.join(process.cwd(), "data", "db.json");
  private tasks: Task[];

  constructor() {
    const data = fs.readFileSync(this.filePath, "utf8");
    const tasks = JSON.parse(data) as Task[];

    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }

  async addTask(task: Task) {
    this.tasks.push(task);

    await fs.writeFileSync(this.filePath, JSON.stringify(this.tasks));
  }

  async updateTask(
    task: Pick<Task, "id" | "title" | "description" | "completed">
  ) {
    const index = this.tasks.findIndex((t) => t.id === task.id);

    if (index !== -1) {
      const actualTask = this.tasks[index];
      this.tasks[index] = {
        ...actualTask,
        title: task.title,
        description: task.description,
        completed: task.completed,
        updatedAt: new Date().toISOString(),
      };
    }

    await fs.writeFileSync(this.filePath, JSON.stringify(this.tasks));
  }

  async deleteTask(id: string) {
    const index = this.tasks.findIndex((t) => t.id === id);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }

    await fs.writeFileSync(this.filePath, JSON.stringify(this.tasks));
  }
}
