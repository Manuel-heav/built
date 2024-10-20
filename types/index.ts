export interface TagTypes {
  id: number;
  title: string;
  url: string;
}

export interface ProjectType {
  description: string;
  id: number;
  imageUrl: string;
  title: string;
  tags: string[];
  githubRepo: string;
  liveDemo: string;
  telegramChannel: string;
  likes: number;
  comments: number;
}
