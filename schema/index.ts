import { z } from "zod";

export const formSchema = z.object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters"),
    imageUrl: z.string().url("Please provide a valid URL for the image"),
    tags: z
      .array(z.enum(["Software", "UI/UX", "Libraries", "Packages", "Tools"]))
      .min(1, "Please select at least one tag"),
    githubRepo: z.string().url("Please provide a valid GitHub repository URL"),
    liveDemo: z.string().url("Please provide a valid live demo URL"),
    telegramChannel: z.string().optional(),
  });