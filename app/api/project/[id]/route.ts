import { Hono } from "hono";
import { handle } from "hono/vercel";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/project/:id", async (c) => {
  const { id } = c.req.param();

  const { data, error } = await supabase.from("projects").select("*").eq("id", id);

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json({ project: data });
});

export const GET = handle(app);
