import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostEditor from "@/components/posts/editor/postEditor";
import { TrendsSidebar } from "@/components/trendsSidebar";
import FollowingFeed from "./followingFeed";
import ForYouFeed from "./forYouFeed";

export default async function Home() {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="forYou">
          <TabsList>
            <TabsTrigger value="forYou">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="forYou">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </section>
  );
}
