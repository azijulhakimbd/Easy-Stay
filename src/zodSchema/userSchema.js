import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(6, "Username must be at least 6 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const userData = z.object({
  username: usernameValidation,
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please provide a valid email"),
});
export const loginSchema=z.object({
  email:z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
 export const codeSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  
  }),
    email: z.string().email("Invalid email address").optional(),
  
})