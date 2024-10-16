import React from "react";
import Container from "./container";
import ProjectFilter from "./project-filter";
import { projects } from "@/constants";
import ProjectCard from "./project-card";

const ProjectsContainer = () => {
  return (
    <div>
      <Container>
        <ProjectFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
          {[...projects, ...projects, ...projects].map((project) => (
            <ProjectCard
              id={project.id}
              key={project.id}
              imageUrl={project.imageUrl}
              title={project.title}
              tags={project.tags}
              githubRepo={project.githubRepo}
              liveDemo={project.liveDemo}
              telegramChannel={project.telegramChannel}
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
