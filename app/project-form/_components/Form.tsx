"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { formSchema } from "@/schema";



const TagButton = ({
  tag,
  selected,
  onClick,
}: {
  tag: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      selected
        ? "bg-white text-[#151519]"
        : "bg-transparent text-white border border-white"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{
      backgroundColor: selected ? "#ffffff" : "rgba(255, 255, 255, 0)",
    }}
  >
    {tag}
  </motion.button>
);

export default function ProjectSubmissionForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      tags: [],
      github_repo: "",
      live_demo: "",
      telegram_channel: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);
    const projectValues = {
    ...values, user_id: session?.user.id 
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectValues),
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }
      router.push("/")


      console.log(values);

      toast("Project Succesffully Submitted");

      form.reset();
      setImagePreview(null);
    } catch (error) {
      setSubmitError(
        "An error occurred while submitting the project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 300000) {
        toast("Image size should not exceed 300 KB");
        return;
      }
      toast("Uploading...");
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result as string);
        form.setValue("imageUrl", URL.createObjectURL(file));

        const bucket = "projects";
        const randomFileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(randomFileName, file);

        if (error) {
          alert("Error uploading file.");
          return;
        }

        const fileUrl = await supabase.storage
          .from(bucket)
          .getPublicUrl(randomFileName);

        form.setValue("imageUrl", fileUrl.data.publicUrl);
        toast("Upload complete!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#151519] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1c1c21] rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Submit Your Project
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project title"
                      {...field}
                      className="bg-[#25252b] text-white border-[#35353d] focus:border-[#4d4d57] focus:ring-[#4d4d57]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      {...field}
                      className="bg-[#25252b] text-white border-[#35353d] focus:border-[#4d4d57] focus:ring-[#4d4d57]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Thumbnail</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-[#35353d] rounded-lg cursor-pointer hover:border-[#4d4d57] transition-colors"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-[#6e6e78]" />
                        )}
                      </label>
                      <Input {...field} type="hidden" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[#9c9ca6]">
                    Upload a project image or provide a URL
                  </FormDescription>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Tags</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Software",
                        "UI/UX",
                        "Libraries",
                        "Packages",
                        "Tools",
                      ].map((tag) => (
                        <TagButton
                          key={tag}
                          tag={tag}
                          selected={field.value.includes(
                            tag as
                              | "Software"
                              | "UI/UX"
                              | "Libraries"
                              | "Packages"
                              | "Tools"
                          )}
                          onClick={() => {
                            const updatedTags = field.value.includes(
                              tag as
                                | "Software"
                                | "UI/UX"
                                | "Libraries"
                                | "Packages"
                                | "Tools"
                            )
                              ? field.value.filter((t) => t !== tag)
                              : [
                                  ...field.value,
                                  tag as
                                    | "Software"
                                    | "UI/UX"
                                    | "Libraries"
                                    | "Packages"
                                    | "Tools",
                                ];
                            field.onChange(updatedTags);
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription className="text-[#9c9ca6]">
                    Select all that apply
                  </FormDescription>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github_repo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    GitHub Repository
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter GitHub repository URL"
                      {...field}
                      className="bg-[#25252b] text-white border-[#35353d] focus:border-[#4d4d57] focus:ring-[#4d4d57]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="live_demo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Live Demo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter live demo URL"
                      {...field}
                      className="bg-[#25252b] text-white border-[#35353d] focus:border-[#4d4d57] focus:ring-[#4d4d57]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telegram_channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Telegram Channel (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Telegram channel (@DagmawiBabi)"
                      {...field}
                      className="bg-[#25252b] text-white border-[#35353d] focus:border-[#4d4d57] focus:ring-[#4d4d57]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ff6b6b]" />
                </FormItem>
              )}
            />
            {submitError && (
              <Alert
                variant="destructive"
                className="bg-[#ff6b6b] text-white border-[#ff8f8f]"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg w-full bg-white text-[#3a3a43] cursor-pointer transition duration-700 hover:shadow-[0_0_50px_15px_rgba(255,255,255,0.1),0_0_100px_40px_rgba(255,255,255,0.1)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="small" /> : "Submit Project"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
