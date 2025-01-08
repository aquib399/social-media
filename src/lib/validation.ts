import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email(),
  username: z
    .string()
    .nonempty()
    .trim()
    .regex(/^[a-zA-Z-0-9_-]+$/, "Special characters are not allowed"),
  password: z
    .string()
    .nonempty()
    .min(8, "Password must be at least 8 characters long"),
});
export type SignUpValues = z.infer<typeof signupSchema>;

export const signInSchema = z.object({
  username: z.string().nonempty().trim(),
  password: z
    .string()
    .nonempty()
    .min(8, "Password must be at least 8 characters long"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const createPostSchema = z.object({
  content: z.string().nonempty().trim(),
});
export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateProfileSchema = z.object({
  displayName: z.string().nonempty("Name is required").trim(),
  bio: z.string().max(1000, "Max 1000 characers allowed"),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
