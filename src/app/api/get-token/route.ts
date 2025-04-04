import streamServerClient from "@/lib/stream";
import { validateRequest } from "@/auth";

export async function GET() {
  try {
    const { user } = await validateRequest();

    console.log("Calling get-token for user: ", { userID: user?.id });

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const expirationTime = Math.floor((Date.now() + 3600 * 1000) / 1000);

    // const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(user.id);

    console.log({ token });
    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
