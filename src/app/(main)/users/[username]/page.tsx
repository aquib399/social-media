import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { TrendsSidebar } from "@/components/trendsSidebar";
import FollowerCount from "@/components/followerCount";
import FollowButton from "@/components/followButton";
import EditProfileButton from "./editProfileButton";
import UserAvatar from "@/components/userAvatar";
import Linkify from "@/components/linkify";
import { notFound } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import UserPostFeed from "./userPostFeed";
import { validateRequest } from "@/auth";
import { formatDate } from "date-fns";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { cache } from "react";

interface UserPageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedUserId),
  });
  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const { user: loggedUser } = await validateRequest();
  if (!loggedUser) return {};

  const user = await getUser(username, loggedUser.id);
  if (!user) return notFound();

  const userTitle = `${user.displayName} (@${user.username}) | My Website Name`;
  const userDescription = `${user.displayName} is a member of our community. Explore their posts, followers, and more.`;

  return {
    title: userTitle,
    description: userDescription,
    keywords: `${user.displayName}, @${user.username}, user profile, blog posts, followers, community`,
    openGraph: {
      title: userTitle,
      description: userDescription,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/users/${user.username}`,
      type: "profile",
      images: user.avatarUrl!,
    },
    twitter: {
      card: "summary_large_image",
      title: userTitle,
      description: userDescription,
      images: user.avatarUrl!,
    },
  };
}

export default async function UserPage({
  params: { username },
}: UserPageProps) {
  const { user: loggedUser } = await validateRequest();
  if (!loggedUser)
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page
      </p>
    );
  const user = await getUser(username, loggedUser.id);
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedUserId={loggedUser.id} />
        <div className="rounded-xl bg-card p-3 shadow-sm sm:rounded-2xl">
          <h2 className="text-center text-xl font-semibold">
            {user.displayName}&apos;s Posts
          </h2>
        </div>
        <UserPostFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </div>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedUserId: string;
}

async function UserProfile({ user, loggedUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollwedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-xl bg-card p-5 shadow-sm sm:rounded-2xl">
      <UserAvatar
        user={user}
        size={720}
        className="mx-auto h-full max-h-60 w-full max-w-60"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap justify-between">
        <div className="mx-autp space-y-3">
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <h2 className="text-muted-foreground">@{user.username}</h2>
          </div>
          <div>Member since {formatDate(user.createdAt, "dd MMM yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton intialState={followerInfo} userId={user.id} />
        )}
      </div>

      {user.bio ? (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
