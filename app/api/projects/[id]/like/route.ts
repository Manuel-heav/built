import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectLikes, projects } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user_id = params.id;
  try {
    const liked = await db
      .select({ projectId: projectLikes.projectId })
      .from(projectLikes)
      .where(eq(projectLikes.userId, user_id));
    const ids = liked.map((r) => r.projectId).filter(Boolean) as string[];
    const rows = ids.length
      ? await db.select().from(projects).where(inArray(projects.id, ids))
      : [];
    return NextResponse.json({ projects: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;
  const { user_id } = await req.json();
  try {
    const existing = await db
      .select()
      .from(projectLikes)
      .where(and(eq(projectLikes.userId, user_id), eq(projectLikes.projectId, projectId)));

    if (existing.length) {
      await db
        .delete(projectLikes)
        .where(and(eq(projectLikes.userId, user_id), eq(projectLikes.projectId, projectId)));

      const current = await db
        .select({ likes: projects.likes })
        .from(projects)
        .where(eq(projects.id, projectId));
      const newCount = ((current[0]?.likes as number) || 0) - 1;
      const updated = await db
        .update(projects)
        .set({ likes: newCount })
        .where(eq(projects.id, projectId))
        .returning();
      return NextResponse.json({ message: "Project unliked", updatedData: updated });
    } else {
      await db.insert(projectLikes).values({ userId: user_id, projectId });

      const current = await db
        .select({ likes: projects.likes })
        .from(projects)
        .where(eq(projects.id, projectId));
      const newCount = ((current[0]?.likes as number) || 0) + 1;
      const updated = await db
        .update(projects)
        .set({ likes: newCount })
        .where(eq(projects.id, projectId))
        .returning();
      return NextResponse.json({ message: "Project liked", updatedData: updated });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
