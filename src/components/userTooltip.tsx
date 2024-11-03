import { useSession } from "@/app/(main)/sessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import { PropsWithChildren } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import UserAvatar from "./userAvatar";

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
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
          <div className="flex items-center justify-between gap-2">
            <Link href={"/user/" + user.id}>
              <UserAvatar user={user} />
            </Link>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
