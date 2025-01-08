import { NextRequest } from "next/server";
import { validateRequest } from "@/auth";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize")) || 10;

    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      },
      include: getPostDataInclude(user.id),

      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      // cacheStrategy: { swr: 60, ttl: 300 },
    });
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("For you posts error", { error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
