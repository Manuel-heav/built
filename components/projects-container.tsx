"use client";
import React, { useEffect, useState } from "react";
import Container from "./container";
import ProjectFilter from "./project-filter";
import ProjectCard from "./project-card";
import { ProjectType } from "@/types";
import { authClient } from "@/lib/auth-client";

const SkeletonProjectCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-500 h-48 w-full mb-4 rounded-lg"></div>
      <div className="h-4 bg-gray-500 w-3/4 mb-2 rounded"></div>
      <div className="h-4 bg-gray-500 w-1/2 rounded"></div>
    </div>
  );
};

const ProjectsContainer = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [likedProjectIds, setLikedProjectIds] = useState<Set<number>>(new Set()); 

  const user_id = session?.user.id;

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const [projectsResponse, likedProjectsResponse] = await Promise.all([
          fetch("/api/projects"),
          user_id ? fetch(`/api/projects/${user_id}/like`) : null,
        ]);

        if (!projectsResponse.ok) {
          throw new Error("Projects fetch failed");
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects);

        if (likedProjectsResponse && likedProjectsResponse.ok) {
          const likedProjectsData = await likedProjectsResponse.json();
          const likedIds = new Set<number>(likedProjectsData.projects.map((project: ProjectType) => project.id));
          setLikedProjectIds(likedIds);
        }

        setLoading(false);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, [user_id]);

  return (
    <div>
      <Container>
        <ProjectFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, idx) => <SkeletonProjectCard key={idx} />)
            : projects.map((project) => {
                const isLiked = likedProjectIds.has(project.id);

                return (
                  <ProjectCard
                    description={project.description}
                    id={project.id}
                    key={project.id}
                    image_url={project.image_url}
                    title={project.title}
                    tags={project.tags}
                    github_repo={project.github_repo}
                    live_demo={project.live_demo}
                    telegram_channel={project.telegram_channel}
                    likes={project.likes}
                    comments={project.comments}
                    isLiked={isLiked} 
                  />
                );
              })}
        </div>
      </Container>
    </div>
  );
};

export default ProjectsContainer;
