import { getPostDataInclude, UserData } from "@/lib/types";
import FollowButton from "@/components/followButton";
import { notFound, redirect } from "next/navigation";
import UserToolTip from "@/components/userTooltip";
import UserAvatar from "@/components/userAvatar";
import Linkify from "@/components/linkify";
import Post from "@/components/posts/post";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";

interface PostPageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });
  if (!post) return notFound();
  return post;
});

export const generateMetadata = async ({
  params: { postId },
}: PostPageProps): Promise<Metadata> => {
  const { user } = await validateRequest();
  if (!user) return {};

  const post = await getPost(postId, user.id);
  if (!post) return notFound();

  const postTitle = `${post.content.slice(0, 50)}...`;
  const postDescription = `${post.content.slice(0, 150)}...`;
  const images = post.media.find((media) => media.type === "image")?.url;

  return {
    title: postTitle,
    description: postDescription,
    keywords: `${post.content.slice(0, 50).replace(/\s+/g, ", ")}, blog post, ${post.user.displayName}`,
    openGraph: {
      title: postTitle,
      description: postDescription,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${postId}`,
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: postTitle,
      description: postDescription,
      images,
    },
  };
};

export default async function PostPage({ params: { postId } }: PostPageProps) {
  const { user } = await validateRequest();
  if (!user) redirect("/signin");
  const post = await getPost(postId, user.id);
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <UserInfoSideBar user={post.user} />
    </section>
  );
}

async function UserInfoSideBar({ user }: { user: UserData }) {
  const { user: loggedUser } = await validateRequest();
  if (!loggedUser) return;
  return (
    <div className="sticky top-20 space-y-5 min-w-72 w-80 bg-card rounded-2xl p-5 size-fit">
      <span>About this user</span>
      <UserToolTip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex gap-3 items-center group/user size-fit"
        >
          <UserAvatar user={user} />
          <div className="flex flex-col gap-0">
            <p>{user.displayName}</p>
            <p className="text-xs group-hover/user:underline text-primary">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      {user.bio && (
        <Linkify>
          <div className="overflow-hidden whitespace-pre-line break-words text-muted-foreground line-clamp-6">
            {user.bio}
          </div>
        </Linkify>
      )}
      {loggedUser?.id !== user.id && (
        <FollowButton
          userId={user.id}
          intialState={{
            followers: user._count.followers,
            isFollwedByUser: user.followers.some(
              (follower) => follower.followerId === loggedUser?.id,
            ),
          }}
        />
      )}
    </div>
  );
}
