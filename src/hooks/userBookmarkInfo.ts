import { useQuery } from "@tanstack/react-query";
import { BookmarkInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";

export default function useBookmarkInfo(
  postId: string,
  initialState: BookmarkInfo,
) {
  const query = useQuery({
    queryKey: ["bookmark-info", postId],
    queryFn: async () => {
      const data = await kyInstance
        .get("/api/posts/" + postId + "/bookmarks")
        .json<BookmarkInfo>();
      return data;
    },
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
