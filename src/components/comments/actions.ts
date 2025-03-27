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
    const newComment = await prisma.comment.create({
      data: { content: contentValidate, postId: post.id, userId: user.id },
      include: getCommentDataInclude(user.id),
    });
    return newComment;
  } catch (error) {}
}
