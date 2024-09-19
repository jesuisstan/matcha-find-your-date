import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().nullable(),
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  nickname: z.string(),
  birthdate: z.string(),
  sex: z.enum(['male', 'female']),
  biography: z.string(),
  tags: z.array(z.string()),
  registration_date: z.string(),
  last_action: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  online: z.boolean(),
  raiting: z.number(),
  sex_preferences: z.enum(['men', 'women', 'bisexual']).nullable(),
  photos: z.array(z.string()),
  confirmed: z.boolean(),
  complete: z.boolean(),
});

export type TUser = z.infer<typeof userSchema>;
