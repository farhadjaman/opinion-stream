import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(6, "Username must be atleast 2 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters and numbers");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});
