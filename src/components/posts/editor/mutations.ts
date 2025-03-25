import { useSession } from "@/app/(main)/sessionProvider";
import { editPost, submitPost } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import {
  useMutation,
  InfiniteData,
  QueryFilters,
  useQueryClient,
  Query,
} from "@tanstack/react-query";

export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { user } = useSession();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["post-feed"] as const,
          predicate(query) {
            return (
              query.queryKey.includes("for-you") ||
              (query.queryKey.includes("user-posts") &&
                query.queryKey.includes(user?.id!))
            );
          },
        };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        //@ts-ignore
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
          return !!(
            queryFilter.predicate &&
            queryFilter.predicate(
              query as Query<
                InfiniteData<PostsPage, string | null>,
                Error,
                InfiniteData<PostsPage, string | null>,
                readonly unknown[]
              >,
            ) &&
            !query.state.data
          );
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

export function useUpdatePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: async (updatedPost) => {
      if (updatedPost instanceof Error)
        throw new Error("Internal server error");

      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["post-feed"],
        };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        //@ts-ignore
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((post) => ({
              nextCursor: post.nextCursor,
              posts: post.posts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post,
              ),
            })),
          };
        },
      );
      toast({
        title: "Post created",
        description: "Your post has been updated successfully",
      });
    },

    onError(error) {
      console.error("Mutation error: ", error);
      toast({
        variant: "destructive",
        title: "Somewthing went wrong",
        description: "Failed to update post. Please try again",
      });
    },
  });
  return mutation;
}
