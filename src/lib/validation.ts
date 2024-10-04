import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email(),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z-0-9_-]+$/, "Special characters are not allowed"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignUpValues = z.infer<typeof signupSchema>;

export const signInSchema = z.object({
  username: z.string().trim(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignInValues = z.infer<typeof signInSchema>;
