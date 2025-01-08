import { getUserDataSelect } from "@/lib/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } },
) {
  const { username } = params;
  const { user: loggedUser } = await validateRequest();
  if (!loggedUser)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedUser.id),
  });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  return Response.json(user);
}
