import { OAuth2RequestError } from "arctic";
import { NextRequest } from "next/server";
import { google, lucia } from "@/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const cookieSet = cookies();
  const storedState = cookieSet.get("state")?.value;
  const storedCodeVerifier = cookieSet.get("code_verifier")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  )
    return new Response(null, { status: 400 });
  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser = (await response.json()) as {
      id: string;
      name: string;
      email: string;
      picture: string;
    };

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            googleId: googleUser.id,
          },
          {
            email: googleUser.email,
          },
        ],
      },
    });
    if (existingUser) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          googleId: googleUser.id,
          avatarUrl: googleUser.picture.replace("s96-c", "s0"),
        },
      });
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieSet.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    } else {
      const user = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          username: googleUser.email.split("@")[0],
          displayName: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.id,
          avatarUrl: googleUser.picture.replace("s96-c", "s0"),
        },
      });
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      const cookieSet = cookies();
      cookieSet.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }
  } catch (error) {
    console.error("Google callback error: ", { error });
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, { status: 500 });
  }
}
