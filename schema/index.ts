import * as z from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  image_url: z.string().url("Please provide a valid URL for the image"),
  tags: z
    .array(z.string())
    .min(1, "Please select at least one tag")
    .max(3, "You can select up to 3 tags"),
  github_repo: z.string().url("Please provide a valid GitHub repository URL"),
  live_demo: z.string().url("Please provide a valid live demo URL"),
  telegram_channel: z.string().optional(),
  documentation: z.string().optional(),
});
