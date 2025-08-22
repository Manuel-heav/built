import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects as projectsTable } from "@/db/schema";
import { and, desc, lt } from "drizzle-orm";


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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");

    const limit = Math.min(Math.max(Number(limitParam) || 12, 1), 50);

    const conditions = [];
    if (cursor) {
      // Since createdAt is stored as a string timestamp, compare as string
      conditions.push(lt(projectsTable.createdAt, cursor));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(projectsTable)
      .where(whereClause)
      .orderBy(desc(projectsTable.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const pageItems = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? pageItems[pageItems.length - 1]?.createdAt ?? null : null;

    return NextResponse.json({ projects: pageItems, nextCursor });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}
