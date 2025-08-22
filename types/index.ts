export interface TagTypes {
  id: number;
  title: string;
}

export interface ProjectType {
  createdAt: Date;
  userId: string;
  documentation: string;
  description: string;
  userName: string;
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
  githubRepo: string;
  liveDemo: string;
  telegramChannel: string;
  likes: number;
  comments: number;
}

export interface RepoStats {
  stars: number;
  forks: number;
  description: string;
  lastUpdated: string;
  openIssues: number;
  language: string;
  watchers: number;
  subscribers: number;
  size: number;
  network: number;
  createdAt: string;
  pushedAt: string;
  defaultBranch: string;
  license: string | null;
  hasIssues: boolean;
  hasProjects: boolean;
  hasDownloads: boolean;
  hasWiki: boolean;
  hasPages: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
}
