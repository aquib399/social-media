import { UploadThingError } from "@uploadthing/shared";
import { createUploadthing } from "uploadthing/next";
import { FileRouter } from "uploadthing/types";
import { UTApi } from "uploadthing/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: {
      maxFileSize: "512KB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: file.url,
        },
      });
      const oldAvatarUrl = metadata.user.avatarUrl;
      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split("/").pop() as string;
        if (key) new UTApi().deleteFiles(key);
      }
      return { avatarUrl: file.url };
    }),

  media: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
    video: {
      maxFileSize: "64MB",
      maxFileCount: 5,
    },
    audio: {
      maxFileSize: "32MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const fileType = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
          ? "video"
          : "audio";

      const media = await prisma.media.create({
        data: {
          url: file.url,
          type: fileType,
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
