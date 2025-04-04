import { validateRequest } from "@/auth";
import { LikeInfo } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          where: {
            likedByUserId: loggedUser.id,
          },
          select: {
            likedByUserId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Get likes error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });
    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.upsert({
        where: {
          postId_likedByUserId: {
            likedByUserId: loggedUser.id,
            postId,
          },
        },
        create: {
          likedByUserId: loggedUser.id,
          postId,
        },
        update: {},
      }),
      ...(loggedUser.id !== post.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return new Response();
  } catch (error) {
    console.error("Like error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedUser } = await validateRequest();
    if (!loggedUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });
    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          likedByUserId: loggedUser.id,
          postId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          recipientId: post.userId,
          issuerId: loggedUser.id,
          type: "LIKE",
          postId,
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error("Unlike error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
