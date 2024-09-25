import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

import { Task } from "@/lib/schema/task-schema";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "db.json");

    const data = await fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(data) as Task[];

    tasks.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Something went wrong reading the tasks:", error);
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
