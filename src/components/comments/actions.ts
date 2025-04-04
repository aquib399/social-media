"use server";

import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const { content: contentValidate } = createCommentSchema.parse({
      post,
      content,
    });
    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: { content: contentValidate, postId: post.id, userId: user.id },
        include: getCommentDataInclude(user.id),
      }),
      ...(post.userId !== user.id
        ? [
            prisma.notification.create({
              data: {
                recipientId: post.userId,
                issuerId: user.id,
                postId: post.id,
                type: "COMMENT",
              },
            }),
          ]
        : []),
    ]);
    return newComment;
  } catch (error) {}
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
