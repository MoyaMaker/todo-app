import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "db.json");

    const data = await fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(data);

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
