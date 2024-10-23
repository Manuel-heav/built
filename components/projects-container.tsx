import React, { useEffect, useState } from "react";
import Container from "./container";
import ProjectFilter from "./project-filter";
import ProjectCard from "./project-card";
import { ProjectType } from "@/types";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProjects(data.projects);
        setLoading(false); 
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Container>
        <ProjectFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
          {loading
            ? 
              Array(6)
                .fill(0)
                .map((_, idx) => <SkeletonProjectCard key={idx} />)
            : 
              projects.map((project) => (
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
                />
              ))}
        </div>
      </Container>
    </div>
  );
};

export default ProjectsContainer;
