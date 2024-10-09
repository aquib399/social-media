import { useSession } from "@/app/(main)/sessionProvider";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { submitPost } from "./actions";
import {
  useMutation,
  InfiniteData,
  QueryFilters,
  useQueryClient,
} from "@tanstack/react-query";

export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { user } = useSession();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user?.id!))
          );
        },
      } satisfies QueryFilters;
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
    },

    onError(error) {
      console.error("Mutation error: ", error);
      toast({
        variant: "destructive",
        title: "Somewthing went wrong",
        description: "Failed to posts. Please try again",
      });
    },
  });
  return mutation;
}
