import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedUserId: string) {
  return {
    id: true,
    username: true,
    avatarUrl: true,
    displayName: true,
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
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedUserId),
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
