"use server";

import { validateRequestAdmin } from "@/auth";
import { Authority } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function deleteUserSession(sessionId: string) {
  const { result } = await validateRequestAdmin();

  if (!result?.session) return new Error("Unauthorized");

  const deletedSession = await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
  if (!deletedSession)
    return new Error("No session found with sessionId " + sessionId);

  return deletedSession;
}

export async function deleteUserAllSession(userId: string) {
  const { result } = await validateRequestAdmin();
  if (!result?.session) return new Error("Unauthorized");

  const deletedSessions = await prisma.session.deleteMany({
    where: {
      userId: userId,
    },
  });
  if (!deletedSessions)
    return new Error("No session found with userid " + userId);

  return deletedSessions;
}

export async function deleteUser(userId: string) {
  const { admin, result } = await validateRequestAdmin();
  if (!result?.session) return new Error("Unauthorized");

  if (admin.authority !== "users_posts_sessions") {
    if (admin.authority !== "all") return new Error("Unauthorized");
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  if (!deletedUser) return new Error("No user found with userId" + userId);

  return deletedUser;
}

export async function deletePost(postId: string) {
  const { admin, result } = await validateRequestAdmin();

  if (!result?.session) return new Error("Unauthorized");
  if (admin.authority === "sessions") return new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  if (!deletedPost) return new Error("No post found with postId" + postId);

  return deletedPost;
}

export async function changeAuthority(adminId: string, authority: Authority) {
  const { admin, result } = await validateRequestAdmin();

  if (!result?.session) return new Error("Unauthorized");
  if (admin.authority !== "all") return new Error("Unauthorized");

  if (authority === "all") return new Error("Not Implemented");

  const updatedAdmin = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: {
      authority,
    },
  });
  return updatedAdmin;
}
