import type { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";
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
  console.log({ media_length: medias.length });

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
  return Response.json({ success: true });
}
