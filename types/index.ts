export interface TagTypes {
  id: number;
  title: string;
  url: string;
}

export interface ProjectType {
  description: string;
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
