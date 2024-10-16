"use client";
import { tags } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ProjectFilter = () => {
  const path = usePathname();

  const isActive = (url: string) => {
    return path === url ? "bg-white text-black" : "hover:text-white";
  };

  return (
    <div className="flex gap-4">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={tag.url}
          className={cn(
            "text-sm text-[#85868d] px-4 py-1 rounded-md cursor-pointer duration-500",
            isActive(tag.url)
          )}
        >
          <p className="">{tag.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProjectFilter;
