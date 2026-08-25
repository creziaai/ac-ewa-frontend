import { z } from "zod";

// Mirrors CredentialsDto:
// @IsEmail() email
// @IsString() @MinLength(12) password.
export const credentialsSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(12, "Password must be at least 12 characters"),
});

// Registration uses the same credentials as login.
// No confirmPassword field because the backend only requires email + password.
export const registerSchema = credentialsSchema;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
});

// Mirrors ResetPasswordDto:
// token, @MinLength(12) password.
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, "Password must be at least 12 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;