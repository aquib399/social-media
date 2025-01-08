import { SessionProvider } from "../(main)/sessionProvider";
import { validateRequestAdmin } from "@/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await validateRequestAdmin();

  if (!result.result?.session)
    return (
      <h1 className="grid h-screen w-full place-content-center text-2xl font-medium text-destructive">
        Unauthorized
      </h1>
    );
  else
    return (
      <SessionProvider value={result.result}>
        <main className="flex min-h-screen flex-col">{children}</main>
      </SessionProvider>
    );
}
