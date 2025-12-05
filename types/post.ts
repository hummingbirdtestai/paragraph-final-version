export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithUser extends Post {
  user: {
    id: string;
    name: string;
    avatar: string;
    institution: string;
    year: string;
  };
}
