"use client";

import { useSession } from "@/app/(main)/sessionProvider";
import { cn, formatRelativeDate } from "@/lib/utils";
import UserAvatar from "@/components/userAvatar";
import BookMarkButton from "../bookmarkButton";
import PostMoreButton from "./postMoreButton";
import Linkify from "@/components/linkify";
import UserToolTip from "../userTooltip";
import { Media } from "@prisma/client";
import LikeButton from "../likeButton";
import { PostData } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function Post({ post }: { post: PostData }) {
  const { user } = useSession();
  return (
    <article className="group/post space-y-2 rounded-xl bg-card p-5 shadow-sm sm:rounded-2xl">
      <Link href={"/posts/" + post.id}>
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
              <span className="block text-sm text-muted-foreground">
                {formatRelativeDate(post.createdAt as Date)}
              </span>
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
        {!!post.media.length && <MediaPreviews medias={post.media} />}
      </Link>
      <hr />
      <div className="flex justify-between">
        <LikeButton
          postId={post.id}
          intialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((u) => u.likedByUserId === user?.id),
          }}
        />
        <BookMarkButton
          postId={post.id}
          intialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (b) => b.bookmarkedByUserId === user?.id,
            ),
          }}
        />
      </div>
    </article>
  );
}

interface MediaPreviewsProps {
  medias: Media[];
}
function MediaPreviews({ medias }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        medias.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {medias.map((media, index) => (
        <MediaPreview key={index} media={media} />
      ))}
    </div>
  );
}
interface MediaPreviewProps {
  media: Media;
}
function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type == "image") {
    return (
      <Image
        src={media.url}
        alt="Media Preview"
        width={1280}
        height={1280}
        className="mx-auto size-fit max-h-[30rem] rounded-xl"
      />
    );
  }
  if (media.type == "video") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit h-min max-h-[30rem] rounded-xl"
          controlsList="nodownload"
        />
      </div>
    );
  }
  if (media.type == "audio") {
    return (
      <audio
        src={media.url}
        controls
        controlsList="nodownload"
        className="mx-auto w-full"
      />
    );
  }
  return (
    <p className="w-full text-center text-destructive">
      Unsupported Media type
    </p>
  );
}
