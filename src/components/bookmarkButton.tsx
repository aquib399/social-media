"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import useBookmarkInfo from "@/hooks/userBookmarkInfo";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookmarkInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

interface bookmarkButtonProps extends ButtonProps {
  postId: string;
  intialState: BookmarkInfo;
}

export default function BookMarkButton({
  postId,
  intialState,
  ...props
}: bookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useBookmarkInfo(postId, intialState);
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      data.isBookmarkedByUser
        ? kyInstance.delete("/api/posts/" + postId + "/bookmarks")
        : kyInstance.post("/api/posts/" + postId + "/bookmarks"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => {
        return { isBookmarkedByUser: !previousData?.isBookmarkedByUser };
      });
      toast({
        title:
          "Post " + (data.isBookmarkedByUser ? "unbookemarked" : "bookmarked"),
      });

      return { previousData };
    },
    onError(error, variables, context) {
      console.error("Follow user error: ", error);
      queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousData);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Unable to bookmark post",
      });
    },
  });
  return (
    <Button
      onClick={() => mutate()}
      variant={"ghost"}
      disabled={isPending}
      title="Bookmark Post"
      {...props}
      className={cn(isPending && "animate-pulse", props?.className)}
    >
      {data?.isBookmarkedByUser ? (
        <BookmarkCheck size={20} />
      ) : (
        <Bookmark size={20} />
      )}
    </Button>
  );
}
