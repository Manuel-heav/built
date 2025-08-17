import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects as projectsTable } from "@/db/schema";
import { desc } from "drizzle-orm";


export async function POST(req: NextRequest) {
  const { userId, title, description, imageUrl, tags, githubRepo, liveDemo, telegramChannel, documentation, userName } = await req.json();
  const id = uuidv4();
  try {
    const inserted = await db
      .insert(projectsTable)
      .values({
        id,
        userId,
        userName,
        title,
        description,
        imageUrl,
        tags,
        githubRepo,
        liveDemo,
        telegramChannel,
        documentation,
      })
      .returning();
    return NextResponse.json({ project: inserted });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const rows = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
    return NextResponse.json({ projects: rows });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}
