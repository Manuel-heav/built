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
  title,
  tags,
  githubRepo,
  liveDemo,
  telegramChannel,
  likes,
  comments,
}: ProjectType) => {
  return (
    <div className="">
      <div>
        <Image
          className="hover:opacity-65 duration-200 cursor-pointer border border-gray-800 rounded-sm"
          width={500}
          height={500}
          src={imageUrl}
          alt={title}
        />
        <div className="flex gap-3 pt-4 items-center">
          <h1>{title}</h1>
          <p className="text-xs text-[#85868d]">{tags.join(", ")}</p>
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
  );
};

export default ProjectCard;
