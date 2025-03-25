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

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        bookmarkedByUserId: user.id,
      },
      include: {
        post: { include: getPostDataInclude(user.id) },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor
        ? {
            bookmarkedByUserId_postId: {
              postId: cursor,
              bookmarkedByUserId: user.id,
            },
          }
        : undefined,
    });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].postId : null;

    const data: PostsPage = {
      posts: bookmarks.map((bookmark) => bookmark.post).slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Get posts error", { error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
