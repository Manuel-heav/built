import { ProjectType, TagTypes } from "@/types";

export const tags: TagTypes[] = [
  {
    id: 1,
    title: "All",
    url: "/",
  },
  {
    id: 2,
    title: "Software",
    url: "/software",
  },
  {
    id: 3,
    title: "UI/UX",
    url: "/ui",
  },
  {
    id: 4,
    title: "Libraries",
    url: "/libraries",
  },
  {
    id: 5,
    title: "Packages",
    url: "/packages",
  },
  {
    id: 6,
    title: "Tools",
    url: "/tools",
  },
];

export const projects: ProjectType[] = [
  {
    id: 2,
    imageUrl: "/images/screenshot1.png",
    title: "Shad Cn UI",
    tags: ["UI/UX", "Tools"],
    githubRepo: "https://github.com",
    liveDemo: "https://shadcn-ui.vercel.app",
    telegramChannel: "https://t.me",
    likes: 100,
    comments: 20,
  },
  {
    id: 4,
    imageUrl: "/images/screenshot2.png",
    title: "Shad Cn UI",
    tags: ["UI/UX", "Tools"],
    githubRepo: "https://github.com",
    liveDemo: "https://shadcn-ui.vercel.app",
    telegramChannel: "https://t.me",
    likes: 100,
    comments: 20,
  },
  {
    id: 6,
    imageUrl: "/images/screenshot3.png",
    title: "Shad Cn UI",
    tags: ["UI/UX", "Tools"],
    githubRepo: "https://github.com",
    liveDemo: "https://shadcn-ui.vercel.app",
    telegramChannel: "https://t.me",
    likes: 100,
    comments: 20,
  },
];
