import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobeLock, Rss, ShieldCheck, UsersIcon } from "lucide-react";
import Sessions from "./sessions";
import Admins from "./admins";
import Users from "./users";
import Posts from "./posts";

export default function AdminTabs() {
  return (
    <Tabs defaultValue="admins" className="flex gap-5">
      <TabsList className="sticky top-20 hidden h-fit flex-col space-y-1.5 rounded-xl bg-card px-3 py-5 shadow-sm sm:flex sm:rounded-2xl lg:px-5 xl:w-72">
        <TabsTrigger
          value="admins"
          className="flex items-center justify-start gap-3 w-full text-sm py-2 px-4"
        >
          <ShieldCheck />
          <span>Admins</span>
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="flex items-center justify-start gap-3 w-full text-sm py-2 px-4"
        >
          <UsersIcon />
          <span>Users</span>
        </TabsTrigger>
        <TabsTrigger
          value="posts"
          className="flex items-center justify-start gap-3 w-full text-sm py-2 px-4"
        >
          <Rss />
          <span>Posts</span>
        </TabsTrigger>
        <TabsTrigger
          value="sessions"
          className="flex items-center justify-start gap-3 w-full text-sm py-2 px-4"
        >
          <GlobeLock />
          <span>Sessions</span>
        </TabsTrigger>
      </TabsList>
      <div>
        <TabsContent value="admins">
          <Admins />
        </TabsContent>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="posts">
          <Posts />
        </TabsContent>
        <TabsContent value="sessions">
          <Sessions />
        </TabsContent>
      </div>
    </Tabs>
  );
}
