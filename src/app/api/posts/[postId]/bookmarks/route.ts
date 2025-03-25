import { validateRequest } from "@/auth";
import { BookmarkInfo } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GET(
  _: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        bookmarkedByUserId_postId: {
          bookmarkedByUserId: loggedUser.id,
          postId,
        },
      },
    });

    const data: BookmarkInfo = {
      isBookmarkedByUser: bookmark?.bookmarkedByUserId === loggedUser.id,
    };
    console.log({ data });

    return Response.json(data);
  } catch (error) {
    console.error("Get Bookmark error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  _: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.bookmark.upsert({
      where: {
        bookmarkedByUserId_postId: {
          bookmarkedByUserId: loggedUser.id,
          postId,
        },
      },
      create: {
        bookmarkedByUserId: loggedUser.id,
        postId,
      },
      update: {},
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Bookmark error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.bookmark.deleteMany({
      where: {
        bookmarkedByUserId: loggedUser.id,
        postId,
      },
    });
    return new Response();
  } catch (error) {
    console.error("Unbookmark error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
