import { generateState } from "arctic";
import { cookies } from "next/headers";
import { github } from "@/auth";

export async function GET() {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  const cookieSet = cookies();

  cookieSet.set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV == "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
