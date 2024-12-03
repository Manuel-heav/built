"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "./container";
import ProjectCard from "./project-card";
import ProjectFilter from "./project-filter";
import { ProjectType } from "@/types";
import { authClient } from "@/lib/auth-client";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpWideNarrowIcon, ArrowDownWideNarrowIcon } from "lucide-react";
import NothingHere from "./nothing-here";

const SkeletonProjectCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-500 h-48 w-full mb-4 rounded-lg"></div>
    <div className="h-4 bg-gray-500 w-3/4 mb-2 rounded"></div>
    <div className="h-4 bg-gray-500 w-1/2 rounded"></div>
  </div>
);

const fetchProjects = async () => {
  const response = await fetch(`/api/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
};

const fetchLikedProjects = async (userId: string) => {
  const response = await fetch(`/api/projects/${userId}/like`);
  if (!response.ok) throw new Error("Failed to fetch liked projects");
  return response.json();
};

const ProjectsContainer = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const { data: projectsData, status: projectsStatus } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: likedProjectsData, isLoading: isLikedLoading } = useQuery({
    queryKey: ["likedProjects", userId],
    queryFn: () => fetchLikedProjects(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("");

  const likedProjectIds = useMemo(() => {
    if (!likedProjectsData) return new Set();
    return new Set(
      likedProjectsData.projects.map((project: { id: string }) => project.id)
    );
  }, [likedProjectsData]);

  console.log(likedProjectIds);

  // const filteredProjects = useMemo(() => {
  //   if (!projectsData?.projects) return [];

  //   let projects = [...projectsData.projects];

  //   if (selectedTag) {
  //     projects = projects.filter((project: ProjectType) =>
  //       project.tags.includes(selectedTag)
  //     );
  //   }

  //   if (searchQuery) {
  //     projects = projects.filter((project: ProjectType) =>
  //       project.title.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   projects.sort((a: ProjectType, b: ProjectType) =>
  //     sortOrder === "asc" ? a.likes - b.likes : b.likes - a.likes
  //   );

  //   return projects;
  // }, [projectsData, selectedTag, searchQuery, sortOrder]);

  const filteredProjects = useMemo(() => {
    if (!projectsData?.projects) return [];
  
    let projects = [...projectsData.projects];
  
    projects.sort((a: ProjectType, b: ProjectType) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  
    if (selectedTag) {
      projects = projects.filter((project: ProjectType) =>
        project.tags.includes(selectedTag)
      );
    }
  
    if (searchQuery) {
      projects = projects.filter((project: ProjectType) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (sortOrder === "asc" || sortOrder === "desc") {
      projects.sort((a: ProjectType, b: ProjectType) =>
        sortOrder === "asc" ? a.likes - b.likes : b.likes - a.likes
      );
    }
  
    return projects;
  }, [projectsData, selectedTag, searchQuery, sortOrder]);
  return (
    <div id="projects">
      <Container>
        <div className="flex items-center gap-5 mb-6">
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="flex items-center gap-2 border-2 border-[#616165] rounded-md px-2 py-1 focus-within:border-white transition-colors duration-200">
              <MagnifyingGlassIcon className="h-5" />
              <input
                type="text"
                placeholder={`Search from ${
                  projectsData?.projects.length || 0
                } projects`}
                className="bg-transparent text-[#f0f0f0] focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent text-[#85868d] border-[#616165]"
                >
                  <p className="hidden md:flex">Sort by Likes</p>
                  {sortOrder === "asc" ? (
                    <ArrowUpWideNarrowIcon className="ml-2 h-6 w-6" />
                  ) : (
                    <ArrowDownWideNarrowIcon className="ml-2 h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                  Ascending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                  Descending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ProjectFilter
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />

        {projectsStatus === "success" && filteredProjects.length === 0 && (
          <NothingHere />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-6">
          {projectsStatus === "pending" || isLikedLoading
            ? Array(6)
                .fill(0)
                .map((_, idx) => <SkeletonProjectCard key={idx} />)
            : filteredProjects.map((project: ProjectType) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  isLiked={likedProjectIds.has(project.id)}
                />
              ))}
        </div>
      </Container>
    </div>
  );
};

export default ProjectsContainer;
