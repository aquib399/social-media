import { SessionProvider } from "./sessionProvider";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";
import MenuBar from "./menuBar";
import Navbar from "./navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) redirect("/signin");
  return (
    <SessionProvider value={session}>
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-3 sm:p-5">
          <MenuBar className="sticky top-20 hidden h-fit flex-none space-y-3 rounded-xl bg-card px-3 py-5 shadow-sm sm:block sm:rounded-2xl lg:px-5 xl:w-72" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex justify-between border-t bg-card p-3 sm:hidden" />
      </main>
    </SessionProvider>
  );
}
