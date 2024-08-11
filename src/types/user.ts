import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().nullable(),
  email: z.string().email(),
  confirmed: z.boolean(),
  firstname: z.string(),
  lastname: z.string(),
  nickname: z.string(),
  birthdate: z.string(),
  sex: z.enum(['male', 'female']),
  biography: z.string(),
  tags: z.array(z.string()),
  complete: z.boolean(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  registration_date: z.string(),
  last_connection_date: z.string(),
  online: z.boolean(),
  popularity: z.number(),
  preferences: z.enum(['male', 'female', 'bisexual']),
  avatars: z.array(z.string()),
  service_token: z.string().nullable(),
});

export type TUser = z.infer<typeof userSchema>;
