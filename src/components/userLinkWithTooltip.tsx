"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import UserToolTip from "./userTooltip";
import { UserData } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { HTTPError } from "ky";
import Link from "next/link";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  username,
  children,
}: UserLinkWithTooltipProps) {
  const { data: user } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status == 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });
  if (!user)
    return (
      <Link
        href={"/users/" + username}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  return (
    <UserToolTip user={user}>
      <Link
        href={"/users/" + username}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserToolTip>
  );
}
