import { describe, it, expect } from "vitest";
import { REGEXP } from "./constants";

describe("REGEXP.email", () => {
  it("debería aceptar emails alfanuméricos válidos", () => {
    const validEmails = [
      "abcd@domain.com",
      "abcd123@server.net",
      "testuser123@sub.domain.org",
      "user123@domain.co.uk",
      "name123@domain.io",
    ];
    validEmails.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(true);
    });
  });

  it("debería aceptar emails válidos con guiones y puntos", () => {
    const validEmails = [
      "abcd.fgh@domain.com",
      "abcd-fgh@domain.com",
      "abcd.fgh-ijk@domain.com",
      "user.name@domain.com",
      "test-email@domain.org",
    ];
    validEmails.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(true);
    });
  });

  it("debería rechazar emails con menos de 4 caracteres antes de @", () => {
    const tooShort = [
      "a@domain.com",
      "ab@domain.com",
      "abc@domain.com",
    ];
    tooShort.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });

  it("debería rechazar emails con espacios", () => {
    const withSpaces = [
      "abc d@domain.com",
      " abcd@domain.com",
      "abcd @domain.com",
      "abcd@ domain.com",
      "abcd@domain .com",
      "abcd@do main.com",
      "abc d@do main.com",
    ];
    withSpaces.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });

  it("debería rechazar emails con caracteres inválidos", () => {
    const invalidChars = [
      "abcd!@domain.com",
      "abcd$@domain.com",
      "abcd%25@domain.com",
      "abcd@@domain.com",
      "abcd@domain..com",
      "abcd@domain,com",
      "abcd@domain com",
    ];
    invalidChars.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });

  it("debería rechazar emails con guiones bajos (no permitidos por el regexp)", () => {
    const withUnderscores = [
      "john_doe@domain.com",
      "abcd_fgh@domain.com",
      "abcd_fgh.ijk@domain.com",
      "user_name@domain.com",
    ];
    withUnderscores.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });

  it("debería rechazar emails con punto inicial o final en la parte local", () => {
    const invalidDots = [
      ".abcd@domain.com",
      "abcd.@domain.com",
      ".abcd.@domain.com",
    ];
    invalidDots.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });

  it("debería rechazar emails con letras mayúsculas", () => {
    const withUpperCase = [
      "Abcd@domain.com",
      "ABCD@domain.com",
      "abcd@Domain.com",
      "abcd@DOMAIN.COM",
      "User@domain.com",
    ];
    withUpperCase.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });

  it("debería aceptar dominios con múltiples niveles válidos", () => {
    const validMultiDomain = [
      "abcd@domain.com",
      "abcd@sub.domain.com",
      "abcd@sub.sub2.domain.co.uk",
      "test@servidor.com.mx",
    ];
    validMultiDomain.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(true);
    });
  });

  it("debería rechazar emails con extensiones de dominio inválidas", () => {
    const invalidExtensions = [
      "abcd@domain.c",      // muy corta
      "abcd@domain.comex",  // muy larga
      "abcd@domain.",       // sin extensión
      "abcd@domain",        // sin punto ni extensión
    ];
    invalidExtensions.forEach(email => {
      expect(REGEXP.email.test(email)).toBe(false);
    });
  });
});

describe("REGEXP.username", () => {
  it("debería aceptar usernames alfanuméricos válidos", () => {
    const validUsernames = [
      "abcd",
      "user123",
      "test1234",
      "username2024",
      "admin",
      "user1",
      "abcdef123456",
      "test1",
      "a123",
      "dev2024",
    ];
    validUsernames.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(true);
    });
  });

  it("debería aceptar usernames solo con letras minúsculas", () => {
    const validUsernames = [
      "abcd",
      "usuario",
      "admin",
      "test",
      "username",
      "developer",
    ];
    validUsernames.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(true);
    });
  });

  it("debería rechazar usernames que sean solo números", () => {
    const onlyNumbers = [
      "1234",
      "123456",
      "999999",
      "2024",
      "0000",
      "987654321",
    ];
    onlyNumbers.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(false);
    });
  });

  it("debería rechazar usernames con menos de 4 caracteres", () => {
    const tooShort = [
      "a",
      "ab",
      "abc",
      "12",
      "123",
      "a1",
      "ab2",
    ];
    tooShort.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(false);
    });
  });

  it("debería rechazar usernames con letras mayúsculas", () => {
    const withUpperCase = [
      "Abcd",
      "USER",
      "Test123",
      "USERNAME",
      "Admin",
      "User1",
      "testUSER",
    ];
    withUpperCase.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(false);
    });
  });

  it("debería rechazar usernames con caracteres especiales", () => {
    const withSpecialChars = [
      "user_name",
      "user-name",
      "user@name",
      "user.name",
      "user name",
      "user!123",
      "user$123",
      "user%123",
      "user&123",
      "user*123",
      "user+123",
      "user=123",
      "user?123",
      "user#123",
    ];
    withSpecialChars.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(false);
    });
  });

  it("debería rechazar usernames con espacios", () => {
    const withSpaces = [
      " user",
      "user ",
      " user ",
      "user name",
      "user  123",
      "u ser",
      "  abcd  ",
    ];
    withSpaces.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(false);
    });
  });

  it("debería rechazar usernames vacíos o null", () => {
    const emptyValues = [
      "",
      "   ",
      "\t",
      "\n",
    ];
    emptyValues.forEach(username => {
      expect(REGEXP.username.test(username)).toBe(false);
    });
  });
});