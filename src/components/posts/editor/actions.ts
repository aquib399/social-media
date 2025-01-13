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
