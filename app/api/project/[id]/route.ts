import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/server/session";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, id));
    return NextResponse.json({ project: rows });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates = await req.json();
  const session = await getSession()
  const userId = session?.user.id;

  try {
    await db.update(projects).set(updates).where(and(eq(projects.id, id), eq(projects.userId, userId ?? "")));
    return NextResponse.json({ message: "Project updated successfully" });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getSession()
  const userId = session?.user.id;

  try {
    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId ?? "")));
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 400 });
  }
}
