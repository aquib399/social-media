"use client";

import InfiniteScrollContainer from "@/components/infiniteScrollContainer";
import PostLoadingSkeleton from "@/components/postLoadingSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "@/components/posts/post";
import { PostsPage } from "@/lib/types";
import { Loader2 } from "lucide-react";
import kyInstance from "@/lib/ky";

export default function FollowingFeed() {
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["post-feed", "following"],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            "/api/posts",
            pageParam
              ? {
                  searchParams: {
                    cursor: pageParam,
                    pageSize: 10,
                    type: "following",
                  },
                }
              : { searchParams: { pageSize: 10, type: "following" } },
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
        No one in your following has posted something
      </p>
    );

  if (status === "error")
    return (
      <p className="text-center text-destructive">
        An Error occured while loading posts
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
