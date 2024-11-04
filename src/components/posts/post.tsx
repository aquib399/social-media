"use client";

import { useSession } from "@/app/(main)/sessionProvider";
import { formatRelativeDate } from "@/lib/utils";
import UserAvatar from "@/components/userAvatar";
import PostMoreButton from "./postMoreButton";
import Linkify from "@/components/linkify";
import UserToolTip from "../userTooltip";
import { PostData } from "@/lib/types";
import Link from "next/link";

export default function Post({ post }: { post: PostData }) {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-xl bg-card p-5 shadow-sm sm:rounded-2xl">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserToolTip user={post.user}>
            <Link href={"#users/" + post.user.username}>
              <UserAvatar user={post.user} />
            </Link>
          </UserToolTip>
          <div>
            <UserToolTip user={post.user}>
              <Link
                href={"/users/" + post.user.username}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserToolTip>
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
      <Linkify>
        <div className="whitespace-pre-wrap break-words">{post.content}</div>
      </Linkify>
    </article>
  );
}
