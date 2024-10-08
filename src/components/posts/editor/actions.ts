"use server";

import { createPostSchema } from "@/lib/validation";
import { getPostDataInclude } from "@/lib/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function submitPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");
  const { content } = createPostSchema.parse({ content: input });
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });
  return newPost;
}
