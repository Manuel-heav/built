import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments as commentsTable, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Comment {
  name: string;
  id: string;
  projectId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
}

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { projectId, userId, content, parentId, name } = await req.json();

  const newComment: Comment = {
    id: uuidv4(),
    projectId,
    name,
    userId,
    content,
    parentId: parentId || null,
    createdAt: new Date().toISOString(),
  };

  try {
    const inserted = await db
      .insert(commentsTable)
      .values({
        id: newComment.id,
        projectId: newComment.projectId,
        name: newComment.name,
        userId: newComment.userId,
        content: newComment.content,
        parentId: newComment.parentId,
        createdAt: newComment.createdAt,
      })
      .returning();

    const current = await db
      .select({ comments: projects.comments })
      .from(projects)
      .where(eq(projects.id, projectId));
    const newCount = ((current[0]?.comments as number) || 0) + 1;
    await db.update(projects).set({ comments: newCount }).where(eq(projects.id, projectId));

    return NextResponse.json({ comment: inserted });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
