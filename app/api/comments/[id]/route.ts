import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Comment {
  name: string;
  id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
}

app.get("/comments/:projectId", async (c) => {
  const projectId = c.req.param("projectId");

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) return c.json({ error: error.message }, 500);

  const commentsByParentId: Record<string, Comment[]> = data.reduce(
    (acc, comment) => {
      const key = comment.parent_id ?? "root";
      acc[key] = [...(acc[key] || []), comment];
      return acc;
    },
    {}
  );

  function nestComments(parentId = "root"): Comment[] {
    return (commentsByParentId[parentId] || []).map((comment) => ({
      ...comment,
      replies: nestComments(comment.id),
    }));
  }

  return c.json(nestComments());
});


app.get("/replies/:commentId", async (c) => {
  const commentId = c.req.param("commentId");

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("parent_id", commentId)
    .order("created_at", { ascending: true });

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ replies: data });
});

export const GET = handle(app);
export const POST = handle(app);
