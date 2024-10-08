"use client";

import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { deletePost } from "./actions";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      });
      if (pathname === "/posts/" + deletedPost.id) router.push("/");
    },
    onError(error) {
      console.error("Delete post mutation error: ", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error deleting the post.",
      });
    },
  });

  return mutation;
}
