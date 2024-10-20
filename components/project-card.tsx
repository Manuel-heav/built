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
  imageUrl,
  description,
  title,
  tags,
  githubRepo,
  liveDemo,
  telegramChannel,
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
    <div className="hover:scale-105 hover:shadow-2xl hover:bg-[#24242a] pb-4 rounded-lg duration-200 ">
      <div>
        <Image
          className="cursor-pointer border border-gray-800 rounded-sm"
          width={500}
          height={500}
          src={imageUrl}
          alt={title}
        />
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
              <Link href={githubRepo}>
                <GithubIcon />
              </Link>
              <Link href={telegramChannel}>
                <TelegramIcon />
              </Link>
              <Link href={liveDemo}>
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
