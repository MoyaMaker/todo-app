import { v4 as uuid } from "uuid";
import { TaskDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { taskSchema } from "@/lib/schema/task-schema";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const dataParsed = taskSchema
      .omit({
        id: true,
      })
      .safeParse(data);

    if (!dataParsed.success) {
      console.error("Data parse error:", data, dataParsed.error.issues);
      return NextResponse.json(
        {
          error: dataParsed.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const { title, description } = dataParsed.data;

    const tasks = new TaskDB();

    await tasks.addTask({
      id: uuid(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Something went wrong creating the task:", error);
    return NextResponse.json(
      {
        error: "Something goes wrong",
      },
      {
        status: 500,
      }
    );
  }
}
