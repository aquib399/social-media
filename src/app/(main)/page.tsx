import PostEditor from "@/components/posts/editor/postEditor";
import { TrendsSidebar } from "@/components/trendsSidebar";
import ForYouFeed from "./forYouFeed";

export default async function Home() {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </section>
  );
}
