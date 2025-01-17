"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, ButtonProps } from "./ui/button";
import useLikeInfo from "@/hooks/userLikeInfo";
import { useToast } from "@/hooks/use-toast";
import { LikeInfo } from "@/lib/types";
import { Heart } from "lucide-react";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

interface likeButtonProps extends ButtonProps {
  postId: string;
  intialState: LikeInfo;
}

export default function LikeButton({
  postId,
  intialState,
  ...props
}: likeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useLikeInfo(postId, intialState);
  const queryKey: QueryKey = ["like-info", postId];

  const { mutate } = useMutation({
    mutationFn: async () =>
      data.isLikedByUser
        ? kyInstance.delete("/api/posts/" + postId)
        : kyInstance.post("/api/posts/" + postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<LikeInfo>(queryKey);
      queryClient.setQueryData<LikeInfo>(queryKey, () => {
        return {
          likes:
            (previousData?.likes || 0) + (previousData?.isLikedByUser ? -1 : 1),
          isLikedByUser: !previousData?.isLikedByUser,
        };
      });
      return { previousData };
    },
    onError(error, variables, context) {
      console.error("Follow user error: ", error);
      queryClient.setQueryData<LikeInfo>(queryKey, context?.previousData);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Unable to like post",
      });
    },
  });
  return (
    <Button
      onClick={() => mutate()}
      variant={"ghost"}
      {...props}
      className={cn("flex items-center gap-1", props?.className)}
    >
      <span>{Number(data.likes)}</span>
      <Heart stroke="red" className={cn(data?.isLikedByUser && "fill-red-500")} />
    </Button>
  );
}
