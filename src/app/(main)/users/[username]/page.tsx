import { TrendsSidebar } from "@/components/trendsSidebar";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { notFound } from "next/navigation";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { cache } from "react";
import UserAvatar from "@/components/userAvatar";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "@/components/followerCount";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FollowButton from "@/components/followButton";
import UserPostFeed from "./userPostFeed";

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
  return {
    title: `${user.displayName} (@${user.username})})`,
    description: "",
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
        className="mx-auto h-full max-h-60 w-full max-w-60"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="mx-autp space-y-3">
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <h2 className="text-muted-foreground">@{user.username}</h2>
          </div>
          <div>Member since {formatDate(user.createdAt, "dd-MMM-yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.followers)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
          {user.id === loggedUserId ? (
            <Button asChild>
              <Link href={"/profile/edit"}>Edit Profile</Link>
            </Button>
          ) : (
            <FollowButton intialState={followerInfo} userId={user.id} />
          )}
        </div>
      </div>
      {user.bio ? (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
