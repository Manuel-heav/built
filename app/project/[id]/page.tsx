"use client";
import Container from "@/components/container";
import { GithubIcon, TelegramIcon } from "@/components/icons/icons";
import { ProjectType } from "@/types";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
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
            <div className="md:w-2/3 h-64 bg-gray-200 rounded-lg"></div>
            <div className="md:w-2/3 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
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
          {/* Enlarged Project Image */}
          <div className="md:w-3/5">
            <img
              src={project.image_url}
              alt={`Project ${project.title}`}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Project Details */}
          <div className="flex flex-col justify-center md:w-1/3">
            <div>
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <p className="text-gray-500 mt-2">{project.description}</p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-sm rounded-lg text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Links */}
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
              {project.live_demo && (
                <Link
                  href={project.live_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowUpRightIcon className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Comments</h3>
          <p className="text-sm text-gray-500 mt-2">No comments for this post yet.</p>
        </div>
      </div>
    </Container>
  );
};

export default SingleProject;
