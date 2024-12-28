"use client";
import CommentSection from "@/components/comments";
import Container from "@/components/container";
import GithubStats from "@/components/github-stats";
import { GithubIcon, TelegramIcon } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ProjectType } from "@/types";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

const SingleProject = ({ params }: ProjectDetailPageProps) => {
  const { id } = params;
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { data: session } = authClient.useSession();
  const router = useRouter()

  const handleDelete = async (id: string) => {
    console.log("Delete started")
    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/project/${id}`, {
        method: 'DELETE',
      });

      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      toast('Project Deleted Successfully');
    } catch (error) {
      toast(`Error Deleting Project: ${error}`);
    }finally{
        setDeleteLoading(false);
        router.push("/")
    }
  } 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/project/${id}`);
        const data = await response.json();
        setProject(data.project[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };
    
    fetchData();
}, [id]);
    console.log(project)

  if (loading) {
    return (
      <Container>
        <div className="animate-pulse flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 h-64 bg-gray-500 rounded-lg"></div>
            <div className="md:w-2/3 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-8 bg-gray-500 rounded w-3/4"></div>
                <div className="h-4 bg-gray-500 rounded w-full"></div>
                <div className="h-4 bg-gray-500 rounded w-full"></div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="h-5 w-5 bg-gray-500 rounded-full"></div>
                <div className="h-5 w-5 bg-gray-500 rounded-full"></div>
                <div className="h-5 w-5 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="h-6 bg-gray-500 rounded w-1/4"></div>
            <div className="h-4 bg-gray-500 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-500 rounded w-full mt-2"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <Container>
      <div className="flex flex-col gap-6 mt-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/5">
            <img
              src={
                project.image_url
                  ? project.image_url
                  : "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png"
              }
              alt={`Project ${project.title}`}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          <div className="flex flex-col justify-center md:w-1/3">
            <div>
                
              {project.user_id === session?.user.id && (
                <div className="flex gap-10">
                  <Link href={`/edit-form/${project.id}`}>
                    <div className="flex gap-1 pb-3">
                      <EditIcon className="text-muted-foreground h-5" />
                      <p className="text-gray-500 text-sm">Edit Project</p>
                    </div>
                  </Link>
                  <Dialog>
                    <DialogTrigger>
                      <div className="items-center flex gap-1 pb-3">
                        <Trash2Icon className="text-red-400 h-5" />
                        <p className="text-red-400 text-sm">Delete Project</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1c1c21] text-gray-300 border-none">
                      <DialogHeader>
                        <DialogTitle className="text-foreground py-2">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          This action cannot be undone. This will permanently
                          delete your project and remove your data from our
                          servers.
                        </DialogDescription>
                      </DialogHeader>
                    <DialogFooter>
                    <Button onClick={() => handleDelete(project.id)} disabled={deleteLoading} className="border-red-400 border text-red-400">{deleteLoading ? "Deleting" : "Delete"}</Button>
                    </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
              <p className="text-gray-500 mt-2">{project.description}</p>
              <div>
                    <p className="text-gray-300 text-xs pt-4">⚒️ {project.user_name}</p>
                </div>
              {project.tags && project.tags.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-transparent text-xs rounded-lg text-foreground border-[#7e7c7c] border-[1px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              {project.github_repo && (
                <Link
                  href={project.github_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <GithubIcon />
                </Link>
              )}
              {project.telegram_channel && (
                <Link
                  href={project.telegram_channel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <TelegramIcon />
                </Link>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <Link
                href={project.live_demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-white transition-colors"
              >
<Button className=" text-foreground bg-background border-border border hover:scale-105 hover:bg-white hover:text-black transition duration-200">                  Live Demo
                </Button>
              </Link>
              {project.documentation && (
                <Link
                  href={project.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="text-foreground bg-background border-border border hover:scale-105 hover:bg-white hover:text-black transition duration-200">
                    See Docs
                  </Button>
                </Link>
              )}
            </div>
            
          </div>
        </div>
        <div>
          <GithubStats github_repo={project.github_repo} />
        </div>
        <div className="mt-6">
          <CommentSection projectId={project.id} />
        </div>
      </div>
    </Container>
  );
};

export default SingleProject;
