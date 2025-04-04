import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedUserId: string) {
  return {
    id: true,
    username: true,
    avatarUrl: true,
    displayName: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedUserId),
    },
    media: true,
    likes: {
      where: {
        likedByUserId: loggedUserId,
      },
      select: {
        likedByUserId: true,
      },
    },
    bookmarks: {
      where: {
        bookmarkedByUserId: loggedUserId,
      },
      select: {
        bookmarkedByUserId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollwedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export function getCommentDataInclude(loggedUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
