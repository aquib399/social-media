import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, Session, TimeSpan, User } from "lucia";
import { GitHub, Google } from "arctic";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import { cache } from "react";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return { ...databaseUserAttributes };
  },
  sessionExpiresIn: new TimeSpan(1, "w"),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  email: string | null;
  githubId: string | null;
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/google`,
);
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch (err) {
      console.warn("Error setting cookie: ", err);
    }

    return result;
  },
);

export const validateRequestAdmin = cache(async () => {
  const result = await validateRequest();
  const admin = await prisma.admin.findUnique({
    where: {
      email: result.user?.email!,
    },
  });
  if (!admin)
    return {
      result: null,
      admin: null,
    };

  return {
    result,
    admin,
  };
});
