import { AdvertPayloadSchema, AdvertSchema } from "./type-advert";

describe("AdvertPayloadSchema", () => {
  it("should parse valid payload correctly", () => {
    const validPayload = {
      name: "Bicicleta",
      price: 150,
      tags: ["deporte", "outdoor"],
      sale: true,
      photo: "photo.jpg",
    };

    const parsed = AdvertPayloadSchema.parse(validPayload);
    expect(parsed).toEqual(validPayload);
  });

  it("should accept photo as null or undefined", () => {
    const payloadNullPhoto = {
      name: "Producto",
      price: 100,
      tags: ["tag1"],
      sale: false,
      photo: null,
    };
    const payloadNoPhoto = {
      name: "Producto",
      price: 100,
      tags: ["tag1"],
      sale: false,
    };

    expect(() => AdvertPayloadSchema.parse(payloadNullPhoto)).not.toThrow();
    expect(() => AdvertPayloadSchema.parse(payloadNoPhoto)).not.toThrow();
  });

  it("should throw on invalid payload", () => {
    const invalidPayload = {
      name: "Producto",
      price: "no es numero",
      tags: "tag1",
      sale: "false",
    };

    expect(() => AdvertPayloadSchema.parse(invalidPayload)).toThrow();
  });
});

describe("AdvertSchema", () => {
  it("should parse valid advert including id and createdAt", () => {
    const validAdvert = {
      id: "abc123",
      createdAt: "2023-01-01T00:00:00Z",
      name: "Bicicleta",
      price: 150,
      tags: ["deporte", "outdoor"],
      sale: true,
      photo: null,
    };

    const parsed = AdvertSchema.parse(validAdvert);
    expect(parsed).toEqual(validAdvert);
  });

  it("should throw if id or createdAt missing", () => {
    const missingFields = {
      name: "Bicicleta",
      price: 150,
      tags: ["deporte", "outdoor"],
      sale: true,
    };

    expect(() => AdvertSchema.parse(missingFields)).toThrow();
  });
});