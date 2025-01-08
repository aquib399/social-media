import { UploadThingError } from "@uploadthing/shared";
import { createUploadthing } from "uploadthing/next";
import { FileRouter } from "uploadthing/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: {
      maxFileSize: "512KB",
    },
    video: {
      maxFileSize: "16MB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file, event }) => {

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: file.url,
        },
      });
      return { avatarUrl: file.url };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
