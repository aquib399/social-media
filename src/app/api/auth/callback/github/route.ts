import { OAuth2RequestError } from "arctic";
import { NextRequest } from "next/server";
import { github, lucia } from "@/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const cookieSet = cookies();
  const storedState = cookieSet.get("state")?.value;

  if (!code || !state || !storedState || state !== storedState)
    return new Response(null, { status: 400 });

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const userPromise = fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const emailsPromise = fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const [userResponse, emailsResponse] = await Promise.all([
      userPromise,
      emailsPromise,
    ]);

    const [githubUser, emails] = (await Promise.all([
      userResponse.json(),
      emailsResponse.json(),
    ])) as [
      { id: number; name: string; avatar_url: string },
      { email: string; primary: boolean }[],
    ];

    const userEmail = emails.find((e) => e.primary)?.email || emails[0]?.email;

    if (!userEmail) {
      return new Response("Unable to retrieve email from GitHub", {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            githubId: String(githubUser.id),
          },
          {
            email: userEmail,
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser) {
        await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            githubId: String(githubUser.id),
            avatarUrl: githubUser.avatar_url,
          },
        });
      }
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
          id: `github-${githubUser.id}`,
          username: githubUser.name || `User-${githubUser.id}`,
          displayName: githubUser.name || `User-${githubUser.id}`,
          email: userEmail,
          githubId: String(githubUser.id),
          avatarUrl: githubUser.avatar_url,
        },
      });
      const session = await lucia.createSession(user.id, {});
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
    }
  } catch (error) {
    console.error("Github callback error: ", { error });
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, { status: 500 });
  }
}
