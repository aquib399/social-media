"use server";

import { createPostSchema, CreatePostValues } from "@/lib/validation";
import { getPostDataInclude } from "@/lib/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function submitPost(input: CreatePostValues) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      media: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });
  return newPost;
}

export async function editPost({
  input,
  postId,
}: {
  input: CreatePostValues;
  postId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const { content, mediaIds } = createPostSchema.parse(input);

  const updatedPost = await prisma.post.update({
    where: { id: postId, userId: user.id },
    data: {
      content,
      userId: user.id,
      media: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  if (!updatedPost) return new Error("Post not found");
  return updatedPost;
}
