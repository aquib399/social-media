"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { signInSchema, SignInValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";

export async function SignIn(cred: SignInValues): Promise<{ error: string }> {
  try {
    const { username, password } = signInSchema.parse(cred);
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!user || !user?.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }
    const validPass = await verify(user.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPass) {
      return {
        error: "Incorrect password",
      };
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    console.error("Signin error", error);
    if (isRedirectError(error)) throw error;
    return {
      error: "Something went wrong",
    };
  }
}
