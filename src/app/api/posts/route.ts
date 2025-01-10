import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize")) || 10;
    const type = req.nextUrl.searchParams.get("type");

    // FOLLOWING
    let whereClause = {};

    if (type == "following") {
      whereClause = {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
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
    console.error("Get posts error", { error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
