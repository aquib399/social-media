"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import useFollwerInfo from "@/hooks/userFollowerInfo";
import { Button, ButtonProps } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { FollowerInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";
interface FollowButtonProps extends ButtonProps {
  userId: string;
  intialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  intialState,
  ...props
}: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useFollwerInfo(userId, intialState);
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: async () =>
      data.isFollwedByUser
        ? kyInstance.delete("/api/users/" + userId + "/followers")
        : kyInstance.post("/api/users/" + userId + "/followers"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => {
        return {
          followers:
            (previousData?.followers || 0) +
            (previousData?.isFollwedByUser ? -1 : 1),
          isFollwedByUser: !previousData?.isFollwedByUser,
        };
      });
      return { previousData };
    },
    onError(error, variables, context) {
      console.error("Follow user error: ", error);
      queryClient.setQueryData<FollowerInfo>(queryKey, context?.previousData);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Unable to follow user",
      });
    },
  });
  return (
    <Button
      variant={data.isFollwedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
      {...props}
    >
      {data.isFollwedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
