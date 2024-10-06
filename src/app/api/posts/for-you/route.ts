import { postDataInclude } from "@/lib/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
    });
		return Response.json(posts);
  } catch (error) {
    console.log("For you posts error", { error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
