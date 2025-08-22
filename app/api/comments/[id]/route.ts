import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments as commentsTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

interface CommentRow {
  name: string | null;
  id: string;
  projectId: string | null;
  userId: string | null;
  parentId: string | null;
  content: string;
  createdAt: string | null;
}

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;
  try {
    const data: CommentRow[] = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.projectId, projectId))
      .orderBy(asc(commentsTable.createdAt));

    const commentsByParentId: Record<string, CommentRow[]> = data.reduce(
      (acc: Record<string, CommentRow[]>, comment: CommentRow) => {
        const key = comment.parentId ?? "root";
        acc[key] = [...(acc[key] || []), comment];
        return acc;
      },
      {}
    );

    const nestComments = (parentId: string = "root"): CommentRow[] => {
      return (commentsByParentId[parentId] || []).map((comment: CommentRow) => ({
        ...comment,
        replies: nestComments(comment.id),
      }));
    };

    return NextResponse.json(nestComments());
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
