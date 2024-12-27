export interface TagTypes {
  id: number;
  title: string;
}

export interface ProjectType {
  created_at: Date;
  user_id: string;
  documentation: string;
  description: string;
  user_name: string;
  id: string;
  image_url: string;
  title: string;
  tags: string[];
  github_repo: string;
  live_demo: string;
  telegram_channel: string;
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
