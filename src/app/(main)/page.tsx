import PostEditor from "@/components/posts/editor/postEditor";
import { TrendsSidebar } from "@/components/trendsSidebar";
import { postDataInclude } from "@/lib/types";
import Post from "@/components/posts/post";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postDataInclude,
  });
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((p, index) => (
          <Post post={p} key={index} />
        ))}
      </div>
      <TrendsSidebar />
    </section>
  );
}
