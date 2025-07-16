import {
  SignUpSchema,
  UserSchema,
  AuthUserSchema,
  CredentialUserSchema,
  JwtSchema,
} from "./types-auth";

describe("Schemas validation", () => {
  it("should validate SignUpSchema with valid data", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      name: "Test User",
    };
    expect(() => SignUpSchema.parse(validData)).not.toThrow();
  });

  it("should fail SignUpSchema with missing fields", () => {
    const invalidData = {
      email: "test@example.com",
      password: "password123",
    };
    expect(() => SignUpSchema.parse(invalidData)).toThrow();
  });

  it("should validate UserSchema with valid data", () => {
    const validData = {
      id: "1",
      email: "user@example.com",
      username: "user1",
    };
    expect(() => UserSchema.parse(validData)).not.toThrow();
  });

  it("should fail UserSchema with invalid email", () => {
    const invalidData = {
      id: "1",
      email: "invalid-email",
      username: "user1",
    };
    expect(() => UserSchema.parse(invalidData)).toThrow();
  });

  it("should validate AuthUserSchema with valid data", () => {
    const validData = {
      id: "1",
      email: "auth@example.com",
      username: "authuser",
      createdAt: "2025-07-05T12:34:56Z",
    };
    expect(() => AuthUserSchema.parse(validData)).not.toThrow();
  });

  it("should validate CredentialUserSchema with optional remember", () => {
    const validData = {
      email: "creds@example.com",
      password: "pass123",
      remember: true,
    };
    expect(() => CredentialUserSchema.parse(validData)).not.toThrow();
  });

  it("should fail CredentialUserSchema with invalid email", () => {
    const invalidData = {
      email: "not-an-email",
      password: "pass123",
    };
    expect(() => CredentialUserSchema.parse(invalidData)).toThrow();
  });

  it("should validate JwtSchema with valid token", () => {
    const validData = {
      accessToken: "some.jwt.token",
    };
    expect(() => JwtSchema.parse(validData)).not.toThrow();
  });

  it("should fail JwtSchema with missing token", () => {
    const invalidData = {};
    expect(() => JwtSchema.parse(invalidData)).toThrow();
  });
});