"use client";

import InfiniteScrollContainer from "@/components/infiniteScrollContainer";
import PostLoadingSkeleton from "@/components/postLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "@/components/posts/post";
import { PostsPage } from "@/lib/types";
import { Loader2 } from "lucide-react";
import kyInstance from "@/lib/ky";

export default function Bookmarks() {
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["post-feed", "bookmarks"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts/bookmarked",
            pageParam
              ? {
                  searchParams: {
                    cursor: pageParam,
                    pageSize: 10,
                    type: "for-you",
                  },
                }
              : { searchParams: { pageSize: 10 } },
          )
          .json<PostsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "pending") return <PostLoadingSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet.
      </p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An Error occured while bookmarks
      </p>
    );

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() =>
        hasNextPage && !isFetchingNextPage && fetchNextPage()
      }
    >
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
