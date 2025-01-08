"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { signupSchema, SignUpValues } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";

export async function SignUp(cred: SignUpValues): Promise<{ error: string }> {
  try {
    const { username, email, password } = signupSchema.parse(cred);

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
          {
            email: {
              equals: email,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (exists) {
      return {
        error:
          exists.email === email
            ? "Email already exists"
            : "Username already exists",
      };
    }

    const hashPass = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const id = generateIdFromEntropySize(10);
    await prisma.user.create({
      data: {
        id,
        username,
        email,
        displayName: username,
        passwordHash: hashPass,
      },
    });
    const session = await lucia.createSession(id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Signup error", error);
    return { error: "Something went wrong" };
  }
}
