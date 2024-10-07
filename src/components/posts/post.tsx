"use client";

import { useSession } from "@/app/(main)/sessionProvider";
import { formatRelativeDate } from "@/lib/utils";
import { PostData } from "@/lib/types";
import UserAvatar from "../userAvatar";
import Link from "next/link";
import PostMoreButton from "./postMoreButton";

export default function Post({ post }: { post: PostData }) {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={"/users/" + post.user.username}>
            <UserAvatar user={post.user} />
          </Link>
          <div>
            <Link
              href={"/users/" + post.user.username}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={"/posts/" + post.id}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt as Date)}
            </Link>
          </div>
        </div>
        {post.userId === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-wrap break-words">{post.content}</div>
    </article>
  );
}
