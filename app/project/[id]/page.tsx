"use client";
import CommentSection from "@/components/comments";
import Container from "@/components/container";
import GithubStats from "@/components/github-stats";
import { GithubIcon, TelegramIcon } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ProjectType } from "@/types";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

const SingleProject = ({ params }: ProjectDetailPageProps) => {
  const { id } = params;
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

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
              src={project.image_url}
              alt={`Project ${project.title}`}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          <div className="flex flex-col justify-center md:w-1/3">
            <div>
              {project.user_id === session?.user.id && (
                <Link href={`/edit-form/${project.id}`}>
                  <div className="flex gap-2 pb-3">
                    <EditIcon className="text-gray-500 h-6" />
                    <p className="text-gray-500 text-sm">Edit Project</p>
                  </div>
                </Link>
              )}
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <p className="text-gray-500 mt-2">{project.description}</p>
              {project.tags && project.tags.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-transparent text-xs rounded-lg text-white border-[#7e7c7c] border-[1px]"
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
                >
                  <GithubIcon />
                </Link>
              )}
              {project.telegram_channel && (
                <Link
                  href={project.telegram_channel}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  className="text-gray-600 hover:text-white transition-colors"
                >
              <Button
                className="border-gray-600 border-2 hover:scale-105 transition duration-200"
              >
                Live Demo
              </Button>
              </Link>
              {project.documentation && (
                <Link
                  href={project.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-black hover:scale-105 hover:bg-white hover:text-black transition duration-200">
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
