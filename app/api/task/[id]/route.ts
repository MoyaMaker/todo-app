import { NextResponse } from "next/server";

import { TaskDB } from "@/lib/db";
import { taskSchema } from "@/lib/schema/task-schema";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const dataParsed = taskSchema.safeParse({
      id: params.id,
      ...data,
    });

    if (!dataParsed.success) {
      return NextResponse.json(
        {
          error: dataParsed.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const { id, title, description, completed } = dataParsed.data;

    const tasks = new TaskDB();

    await tasks.updateTask({
      id,
      title,
      description,
      completed,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tasks = new TaskDB();

    await tasks.deleteTask(params.id);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Something went wrong deleting the task:", error);
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
