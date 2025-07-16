import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string(),
  password: z.string(),
  username: z.string(),
  name: z.string(),
});
export type SignUp = z.infer<typeof SignUpSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthUserSchema = UserSchema.extend({
  createdAt: z.string(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const CredentialUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean().optional(),
});

export type CredentialUser = z.infer<typeof CredentialUserSchema>;

export const JwtSchema = z.object({
  accessToken: z.string(),
});

export type Jwt = z.infer<typeof JwtSchema>;