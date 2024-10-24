import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/projects/:id/like", async (c) => {
  const { id: user_id } = c.req.param(); 

  const { data: likedProjects, error: likeError } = await supabase
    .from("project_likes")
    .select("project_id")
    .eq("user_id", user_id);

  if (likeError) {
    return c.json({ error: likeError.message }, 400);
  }

  const projectIds = likedProjects?.map((project) => project.project_id) || [];

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds);

  if (projectError) {
    return c.json({ error: projectError.message }, 400);
  }

  return c.json({ projects });
});

app.post("/projects/:id/like", async (c) => {
  const { id: projectId } = c.req.param(); 
  const { user_id } = await c.req.json(); 

  const { data: existingLike, error: likeError } = await supabase
    .from("project_likes")
    .select("*")
    .eq("user_id", user_id)
    .eq("project_id", projectId)
    .single();

  if (likeError && likeError.code !== "PGRST116") {
    return c.json({ error: likeError.message }, 400);
  }

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from("project_likes")
      .delete()
      .eq("user_id", user_id)
      .eq("project_id", projectId);

    if (deleteError) {
      return c.json({ error: deleteError.message }, 400);
    }

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("likes")
      .eq("id", projectId)
      .single();

    if (projectError) {
      return c.json({ error: projectError.message }, 400);
    }

    const newLikeCount = (projectData?.likes || 0) - 1;

    const { error: updateError, data: updatedData } = await supabase
      .from("projects")
      .update({ likes: newLikeCount })
      .eq("id", projectId)
      .select(); 

    if (updateError) {
      console.log("Update Error:", updateError.message);
      return c.json({ error: updateError.message }, 400);
    }

    console.log("Update Success:", updatedData);
    return c.json({ message: "Project unliked", updatedData });
  } else {
    const { error: insertError } = await supabase
      .from("project_likes")
      .insert([{ user_id, project_id: projectId }]);

    if (insertError) {
      return c.json({ error: insertError.message }, 400);
    }

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("likes")
      .eq("id", projectId)
      .single();

    if (projectError) {
      return c.json({ error: projectError.message }, 400);
    }

    const newLikeCount = (projectData?.likes || 0) + 1;

    const { error: updateError, data: updatedData } = await supabase
      .from("projects")
      .update({ likes: newLikeCount })
      .eq("id", projectId)
      .select();

    if (updateError) {
      console.log("Update Error:", updateError.message);
      return c.json({ error: updateError.message }, 400);
    }

    console.log("Update Success:", updatedData);
    return c.json({ message: "Project liked", updatedData });
  }
});

export const GET = handle(app);
export const POST = handle(app);
