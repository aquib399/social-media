"use client";
import { useSession } from "@/app/(main)/sessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import FollowerCount from "./followerCount";
import { PropsWithChildren } from "react";
import FollowButton from "./followButton";
import UserAvatar from "./userAvatar";
import Linkify from "./linkify";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface userTooltipsProps extends PropsWithChildren {
  user: UserData;
}

export default function UserToolTip({ user, children }: userTooltipsProps) {
  const { user: loggedUser } = useSession();
  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollwedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={"/user/" + user.username}>
                <UserAvatar user={user} />
              </Link>
              {loggedUser.id !== user.id ? (
                <FollowButton
                  size="sm"
                  title="Follow or Unfollow"
                  className="text-sm"
                  userId={user.id}
                  intialState={followerState}
                />
              ) : (
                ""
              )}
            </div>
            <div>
              <Link href={"/user/" + user.username}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio ? (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            ) : (
              ""
            )}
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
