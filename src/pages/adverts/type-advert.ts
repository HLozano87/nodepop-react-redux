import { z } from "zod";

export const AdvertPayloadSchema = z.object({
  name: z.string(),
  price: z.number(),
  tags: z.array(z.string()),
  sale: z.boolean(),
  photo: z.string().nullable().optional()
})

export type AdvertPayload = z.infer<typeof AdvertPayloadSchema>

export const AdvertSchema = AdvertPayloadSchema.extend({
  id: z.string(),
  createdAt: z.string()
});

export type Advert = z.infer<typeof AdvertSchema>;