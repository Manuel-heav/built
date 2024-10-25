import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

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

app.post("/comments", async (c) => {
  const { project_id, user_id, content, parent_id, name } = await c.req.json();

  const newComment: Comment = {
    id: uuidv4(),
    project_id,
    name,
    user_id,
    content,
    parent_id: parent_id || null,
    created_at: new Date().toISOString(),
  };

  const [commentInsertion, projectUpdate] = await Promise.all([
    supabase.from("comments").insert([newComment]),

    supabase
      .from("projects")
      .select("comments")
      .eq("id", project_id)
      .single()
      .then(({ data: projectData, error: projectError }) => {
        if (projectError) throw new Error(projectError.message);

        const newCommentCount = (projectData?.comments || 0) + 1;
        
        return supabase
          .from("projects")
          .update({ comments: newCommentCount })
          .eq("id", project_id)
          .select();
      }),
  ]);

  const [commentInsertionResult, projectUpdateResult] = [commentInsertion, projectUpdate];

  if (commentInsertionResult.error) {
    return c.json({ error: commentInsertionResult.error.message }, 500);
  }

  if (projectUpdateResult.error) {
    console.log("Update Error:", projectUpdateResult.error.message);
    return c.json({ error: projectUpdateResult.error.message }, 500);
  }

  return c.json({ comment: commentInsertionResult.data });
});

export const POST = handle(app);
