"use client";

import { useQuery } from "@tanstack/react-query";
import Post from "@/components/posts/post";
import { PostData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import kyInstance from "@/lib/ky";

export default function ForYouFeed() {
  
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  });

  if (query.status === "pending")
    return <Loader2 className="mx-auto animate-spin" />;

  if (query.status === "error")
    return (
      <p className="text-center text-destructive">
        An Error occured while loading posts
      </p>
    );

  return (
    <div className="space-y-5">
      {query.data.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
}
