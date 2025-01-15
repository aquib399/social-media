import type { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";
import { formatDate } from "date-fns";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  console.log("-----------CRON JOB EXECUTED-----------");
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const medias = await prisma.media.findMany({
    where: {
      OR: [
        {
          post: { is: null },
        },
        {
          postId: { equals: null },
        },
      ],
      createdAt: {
        lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    select: {
      id: true,
      url: true,
    },
  });

  new UTApi().deleteFiles(
    medias.map((media) => media.url.split("/").pop() as string),
  );
  await prisma.media.deleteMany({
    where: {
      id: {
        in: medias.map((media) => media.id),
      },
    },
  });

  const deletedMediasIds = medias.map((media) => media.url);
  await prisma.setting.create({
    data: {
      type: "Log",
      name: `Deleted medias at: ${formatDate(new Date(), "HH:mm:ss - dd MMM yyyy")}`,
      value: deletedMediasIds,
    },
  });
  return Response.json({ success: true });
}
