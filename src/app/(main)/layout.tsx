import { SessionProvider } from "./sessionProvider";
import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) redirect("/signin");
  return <SessionProvider value={session}>{children}</SessionProvider>;
}
