"use client";
import { tags } from "@/constants";
import { cn } from "@/lib/utils";
import React from "react";

interface ProjectFilterProps {
  selectedTag: string | null; 
  setSelectedTag: (tag: string | null) => void;
}

const ProjectFilter = ({ selectedTag, setSelectedTag }: ProjectFilterProps) => {

  const isActive = (tag: string) => {
    return selectedTag === tag ? "bg-white text-black" : "hover:text-white";
  };

  const isAllActive = () => {
    return selectedTag === null ? "bg-white text-black" : "hover:text-white";
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => setSelectedTag(null)}
        className={cn(
          "text-sm text-[#85868d] px-4 py-1 rounded-md cursor-pointer duration-500",
          isAllActive()
        )}
      >
        All
      </button>

      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => setSelectedTag(tag.title)} 
          className={cn(
            "text-sm text-[#85868d] px-4 py-1 rounded-md cursor-pointer duration-500",
            isActive(tag.title)
          )}
        >
          <p>{tag.title}</p>
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
