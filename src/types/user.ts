import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().nullable(),
  firstname: z.string(),
  lastname: z.string(),
  nickname: z.string(),
  email: z.string().email(),
  confirmed: z.boolean(),
  birthdate: z.string(),
  sex: z.enum(['male', 'female']),
  biography: z.string(),
  tags: z.array(z.string()),
  complete: z.boolean(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  trace: z.string(), // last visit
  online: z.boolean(),
  popularity: z.number(),
  preferences: z.enum(['male', 'female', 'bisexual']),
  avatars: z.array(z.string()),
  lang: z.string(),
});

export type TUser = z.infer<typeof userSchema>;
