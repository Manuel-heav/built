import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

app.post("/projects", async (c) => {
  const {
    user_id,
    title,
    description,
    imageUrl,
    tags,
    githubRepo,
    liveDemo,
    telegramChannel,
  } = await c.req.json();

  const id = uuidv4();

  const { data, error } = await supabase.from("projects").insert([
    {
      id,
      user_id,
      title,
      description,
      image_url: imageUrl,
      tags,
      github_repo: githubRepo,
      live_demo: liveDemo,
      telegram_channel: telegramChannel,
    },
  ]);

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json({ project: data });
});

app.get("/projects", async (c) => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json({ projects: data });
});

app.post("/projects/:id/like", async (c) => {
  console.log("Like request received");
  const { id: projectId } = c.req.param();
  const { user_id } = await c.req.json();
  console.log("Project ID:", projectId, "User ID:", user_id);

  const { data: existingLike, error: likeError } = await supabase
    .from("project_likes")
    .select("*")
    .eq("user_id", user_id)
    .eq("project_id", projectId)
    .single();

  if (likeError) {
    return c.json({ error: likeError.message }, 400);
  }

  if (existingLike) {
    const { error } = await supabase
      .from("project_likes")
      .delete()
      .eq("user_id", user_id)
      .eq("project_id", projectId);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Project unliked" });
  } else {
    const { error } = await supabase.from("project_likes").insert([
      {
        user_id,
        project_id: projectId,
      },
    ]);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Project liked" });
  }
});

export const POST = handle(app);
export const GET = handle(app);
