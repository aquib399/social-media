import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import { cache } from "react";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: databaseUserAttributes;
  }
}

interface databaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  googleId?: string;
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(userData) {
    return userData;
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId)
      return {
        user: null,
        session: null,
      };
    const result = await lucia.validateSession(sessionId);
    if (!result)
      return {
        user: null,
        session: null,
      };
    try {
      let sessionCookie: any;
      if (result.session && result.session.fresh)
        sessionCookie = lucia.createSessionCookie(result.session.id);
      else sessionCookie = lucia.createBlankSessionCookie();

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } catch {}
    return result;
  },
);

const v = validateRequest();
