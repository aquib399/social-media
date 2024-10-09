import { getUserDataSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./followButton";
import { validateRequest } from "@/auth";
import { Loader2 } from "lucide-react";
import UserAvatar from "./userAvatar";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import Link from "next/link";

export async function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
    cacheStrategy: { swr: 60, ttl: 300 },
  });
  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm sm:rounded-2xl">
      <div className="text-lg font-medium">Who to Follow</div>
      {usersToFollow.map((user, index) => {
        return (
          <div key={index} className="flex items-center justify-between gap-3">
            <Link
              href={"/users/" + user.username}
              className="flex items-start gap-3"
            >
              <UserAvatar user={user} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
            <FollowButton
              userId={user.id}
              intialState={{
                followers: user._count.followers,
                isFollwedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
		select lower(unnest(regexp_matches(content, '#[[:alnum:]_]+'))) as hashtag, count(*) as count
		from posts
		group by (hashtag)
		order by count desc, hashtag asc
		limit 5
	`;
    return result.map((row) => ({
      hashTag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 4 * 60 * 60 },
);

async function TrendingTopics() {
  const trending_topics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm sm:rounded-2xl">
      <div className="text-lg font-medium">Trending Topics</div>
      {trending_topics.map((topic, index) => {
        const title = topic.hashTag.replace("#", "");
        return (
          <Link href={"/hashtag/" + title} key={index}>
            <p className="line-clamp-1" title={topic.hashTag}>
              {topic.hashTag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(topic.count)} {topic.count == 1 ? "Post" : "Posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
