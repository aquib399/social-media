import { useQuery } from "@tanstack/react-query";
import { LikeInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";

export default function useLikeInfo(postId: string, initialState: LikeInfo) {
  const query = useQuery({
    queryKey: ["like-info", postId],
    queryFn: async () => {
      const data = await kyInstance
        .get("/api/posts/" + postId)
        .json<LikeInfo>();
      return data;
    },
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
