import { Loader2, UserPlus } from "lucide-react";
import { userDataSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { validateRequest } from "@/auth";
import UserAvatar from "./userAvatar";
import { Button } from "./ui/button";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

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
    },
    select: userDataSelect,
    take: 5,
  });
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-lg font-medium">Who to Follow</div>
      {usersToFollow.map((user, index) => {
        return (
          <div key={index} className="flex items-center justify-between gap-3">
            <Link
              href={"/user/" + user.username}
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
            <Button size="sm" className="text-sm">
              Follow
            </Button>
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
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
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
