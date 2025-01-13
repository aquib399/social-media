import { UpdateProfileValues } from "@/lib/validation";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "./action";
import { useRouter } from "next/navigation";
import { PostsPage } from "@/lib/types";
import {
  useMutation,
  InfiniteData,
  QueryFilters,
  useQueryClient,
} from "@tanstack/react-query";

export function useUpdateProfileMutation() {
  const { startUpload } = useUploadThing("avatar");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startUpload([avatar]),
      ]);
    },

    onSuccess: async (data) => {
      const [updatedUser, result] = data;
      if (updatedUser instanceof Error)
        throw new Error("Internal server error");

      const avatarUrl = result?.[0]?.serverData?.avatarUrl;

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
              posts: post.posts.map((post) => {
                if (post.userId === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: avatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update the profile",
        description: error.message,
      });
    },
  });
  return mutation;
}
