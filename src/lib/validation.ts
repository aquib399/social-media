import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email(),
  username: z
    .string()
    .nonempty()
    .trim()
    .regex(/^[a-zA-Z -0-9_-]+$/, "Special characters are not allowed"),
  displayName: z
    .string({ message: "Display name is required" })
    .nonempty("Display name is required")
    .min(3, "Display name must be at least 3 characters long")
    .trim()
    .regex(/^[a-zA-Z -0-9_-]+$/, "Special characters are not allowed"),
  password: z
    .string()
    .nonempty()
    .min(8, "Password must be at least 8 characters long"),
});
export type SignUpValues = z.infer<typeof signupSchema>;

export const signInSchema = z.object({
  indentifier: z.string().nonempty().trim(),
  password: z
    .string()
    .nonempty()
    .min(8, "Password must be at least 8 characters long"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const createPostSchema = z.object({
  content: z.string().nonempty().trim(),
  mediaIds: z.array(z.string()).max(5),
});
export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateProfileSchema = z.object({
  displayName: z.string().nonempty("Name is required").trim(),
  bio: z.string().max(1000, "Max 1000 characers allowed"),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const createCommentSchema = z.object({
  content: z.string().nonempty().trim(),
});
export type CreateCommentValues = z.infer<typeof createCommentSchema>;
