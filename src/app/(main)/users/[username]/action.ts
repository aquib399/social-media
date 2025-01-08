"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validation";

export async function updateUserProfile(value: UpdateProfileValues) {
  const validatedValue = updateProfileSchema.parse(value);

  const { user } = await validateRequest();

  if (!user) return new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      displayName: validatedValue.displayName,
      bio: validatedValue.bio,
    },
  });
  return updatedUser;
}
