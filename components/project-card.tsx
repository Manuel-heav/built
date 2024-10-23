import { ProjectType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GithubIcon, TelegramIcon } from "./icons/icons";
import {
  ArrowUpRightIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/16/solid";

const ProjectCard = ({
  id,
  image_url,
  description,
  title,
  tags,
  github_repo,
  live_demo,
  telegram_channel,
  likes,
  comments,
}: ProjectType) => {
  const truncateDescription = (description: string) => {
    if (description.length > 50) {
      return description.slice(0, 50) + "...";
    }
    return description;
  };
  return (
    <div className="hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-[#24242a] hover:to-[#33333b] pb-4 rounded-lg duration-200">
      <div>
        <Link href={`/project/${id}`}>
        <Image
          className="cursor-pointer border border-gray-800 rounded-sm overflow-hidden h-40 object-cover"
          width={500} 
          height={300} 
          src={image_url}
          alt={title}
        />
        </Link>
        <div className="px-2 flex justify-between flex-col h-28">
          <div className="flex gap-3 pt-4 items-center">
            <h1>{title}</h1>
            <p className="text-xs text-[#85868d]">{tags.join(", ")}</p>
          </div>
          <div>
            <p className="text-sm text-[#85868d] py-2">
              {truncateDescription(description)}
            </p>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="flex gap-1 items-center">
                <HeartIcon className="h-5 cursor-pointer" />
                <p>{likes}</p>
              </div>

              <div className="flex gap-1 items-center">
                <ChatBubbleBottomCenterIcon className="h-5 cursor-pointer" />
                <p>{comments}</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Link href={github_repo}>
                <GithubIcon />
              </Link>
              <Link href={telegram_channel}>
                <TelegramIcon />
              </Link>
              <Link href={live_demo}>
                <ArrowUpRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
