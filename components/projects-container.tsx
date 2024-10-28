"use client";
import React, { useEffect, useState } from "react";
import Container from "./container";
import ProjectFilter from "./project-filter";
import ProjectCard from "./project-card";
import { ProjectType } from "@/types";
import { authClient } from "@/lib/auth-client";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from "lucide-react";
import { Button } from "./ui/button";

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
  const [likedProjectIds, setLikedProjectIds] = useState<Set<string>>(
    new Set()
  );
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { data: session } = authClient.useSession();

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

        setFilteredProjects(projectsData.projects);

        if (likedProjectsResponse && likedProjectsResponse.ok) {
          const likedProjectsData = await likedProjectsResponse.json();
          const likedIds = new Set<string>(
            likedProjectsData.projects.map((project: ProjectType) => project.id)
          );
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

  useEffect(() => {
    let filtered = projects;

    if (selectedTag) {
      filtered = filtered.filter((project) =>
        project.tags.includes(selectedTag)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.likes - b.likes);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    setFilteredProjects(filtered);
  }, [selectedTag, searchQuery, projects, sortOrder]);

  return (
    <div id="projects">
      <Container>
        <div className="flex items-center gap-5 mb-6">
          {session && (
            <div className="flex gap-2">
            <div className="flex items-center gap-2 border-2 border-[#616165] rounded-md px-2 py-1 focus-within:border-white transition-colors duration-200">
              <MagnifyingGlassIcon className="h-5" />
              <input
                type="text"
                placeholder="Search for projects"
                className="bg-transparent text-[#f0f0f0] focus:outline-none text-sm border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent text-[#85868d] border-[#616165] duration-300 transition">
                <p className="hidden md:flex">Sort by Likes</p> {sortOrder === "asc" ? <ArrowUpWideNarrowIcon className="ml-2 h-6 w-6" /> : <ArrowDownWideNarrowIcon className="ml-2 h-6 w-6" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("asc")} className="cursor-pointer">
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}className="cursor-pointer">
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            </div>
          )}
        </div>

        <ProjectFilter
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-6">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonProjectCard key={idx} />)
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
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
            })
          ) : (
            <div className="p-4">Nothing here 🥴</div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProjectsContainer;
